document.addEventListener('DOMContentLoaded', function() {
    // ====================== GALERIA DE PRODUTOS ======================
    const productGallery = document.getElementById('productGallery');
    const galleryPagination = document.getElementById('galleryPagination');

    // Define suas galerias. Cada sub-array é uma página de imagens.
    const galleries = [
        [ // Galeria 1
            'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg',
            'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg'
        ],
        [ // Galeria 2
            'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg',
            'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg'
        ]
        // Adicione mais galerias aqui conforme necessário
    ];

    let currentGalleryIndex = 0; // Começa na primeira galeria (índice 0)

    function renderGallery(index) {
        productGallery.innerHTML = ''; // Limpa as imagens atuais

        const imagesToLoad = galleries[index];
        if (!imagesToLoad) {
            console.error("Galeria não encontrada para o índice:", index);
            return;
        }

        imagesToLoad.forEach(imagePath => {
            const colDiv = document.createElement('div');
            // Classes responsivas para o layout da galeria
            colDiv.className = 'col-lg-2 col-md-3 col-4 mb-4'; 
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = 'Bolo';
            img.className = 'img-fluid rounded';
            colDiv.appendChild(img);
            productGallery.appendChild(colDiv);
        });

        updatePagination(index);
    }

    function updatePagination(activeIndex) {
        const pageItems = galleryPagination.querySelectorAll('.page-item');
        pageItems.forEach(item => {
            item.classList.remove('active');
        });

        const currentPageItem = galleryPagination.querySelector(`[data-page="${activeIndex + 1}"]`);
        if (currentPageItem) {
            currentPageItem.classList.add('active');
        }

        const prevArrow = galleryPagination.querySelector('[data-page="prev"]');
        const nextArrow = galleryPagination.querySelector('[data-page="next"]');

        if (prevArrow) {
            prevArrow.classList.toggle('disabled', activeIndex === 0);
        }
        if (nextArrow) {
            nextArrow.classList.toggle('disabled', activeIndex === galleries.length - 1);
        }
    }

    // Listener para os cliques na paginação
    galleryPagination.addEventListener('click', function(event) {
        const target = event.target.closest('.page-item');
        if (!target || target.classList.contains('active') || target.classList.contains('disabled')) {
            return;
        }

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

    // Renderiza a galeria inicial
    renderGallery(currentGalleryIndex);

    // ====================== TRANSIÇÃO LOGIN/CADASTRO ======================
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');

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

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;
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

    function clearLoginForm() {
        if (loginForm) {
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginSenha').value = '';
        }
    }

    function clearCadastroForm() {
        if (cadastroForm) {
            document.getElementById('cadastroEmail').value = '';
            document.getElementById('cadastroSenha').value = '';
            document.getElementById('cadastroTelefone').value = '';
        }
    }

    // Bind events para os botões de transição
    if (document.getElementById('showLoginBtn')) {
        document.getElementById('showLoginBtn').addEventListener('click', showLogin);
    }
    if (document.getElementById('showCadastroBtn')) {
        document.getElementById('showCadastroBtn').addEventListener('click', showCadastro);
    }

    // ====================== CHAT ESTATICO ======================
    class ChatBot {
        constructor() {
            this.messageCount = 0;
            this.responses = [
                "Olá! 👋 Como posso ajudá-lo hoje?",
                "Entendi! Deixe-me verificar isso para você...",
                "Posso ajudar com informações sobre nossos produtos e serviços.",
                "Para questões mais específicas, posso conectá-lo com um atendente humano.",
                "Há mais alguma coisa em que posso ajudar?",
                "Obrigado por entrar em contato! Estou aqui sempre que precisar.",
                "Vou anotar sua solicitação e nossa equipe entrará em contato em breve.",
                "Essa é uma ótima pergunta! Vou buscar as informações mais atualizadas."
            ];
            this.quickResponses = {
                'ola': 'Olá! Como posso ajudá-lo?',
                'oi': 'Oi! Em que posso ser útil?',
                'ajuda': 'Claro! Estou aqui para ajudar. O que você precisa?',
                'produto': 'Temos vários produtos disponíveis. Sobre qual você gostaria de saber?',
                'preço': 'Para informações sobre preços, posso conectá-lo com nossa equipe comercial.',
                'contato': 'Você pode nos contatar através deste chat ou pelo email contato@empresa.com',
                'horario': 'Nosso atendimento funciona 24/7 através deste chat!',
                'obrigado': 'De nada! Fico feliz em ajudar! 😊'
            };
            this.init();
        }

        init() {
            this.bindEvents();
            // A verificação `typeof` previne erros se o Bootstrap não for carregado
            if (typeof bootstrap !== 'undefined' && document.getElementById('chatWidget')) {
                this.bootstrapCollapse = new bootstrap.Collapse(document.getElementById('chatWidget'), { toggle: false });
            }
        }

        bindEvents() {
            if (document.querySelector('#supportButton button')) {
                document.querySelector('#supportButton button').addEventListener('click', () => this.openChat());
            }
            if (document.querySelector('#chatWidget .btn-light')) {
                document.querySelector('#chatWidget .btn-light').addEventListener('click', () => this.closeChat());
            }
            if (document.getElementById('sendMessage')) {
                document.getElementById('sendMessage').addEventListener('click', () => this.sendUserMessage());
            }
            if (document.getElementById('messageInput')) {
                document.getElementById('messageInput').addEventListener('keypress', (e) => {
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
                    if (chatMessages) {
                        chatMessages.innerHTML = '<div class="text-muted small">Inicie uma conversa...</div>';
                    }
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
            div.innerHTML = `
                <div class="d-flex align-items-start mb-2">
                    <div class="w-8 h-8 bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2">
                        <i class="bi bi-robot text-white"></i>
                    </div>
                    <div class="bg-light border rounded px-3 py-2" style="max-width: 80%">${message}</div>
                </div>`;
            chatMessages.appendChild(div);
            this.scrollToBottom();
        }

        showTypingIndicator() {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            const div = document.createElement('div');
            div.id = 'typingIndicator';
            div.className = 'mb-4 fade-in';
            div.innerHTML = `
                <div class="d-flex align-items-start mb-2">
                    <div class="w-8 h-8 bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2">
                        <i class="bi bi-robot text-white"></i>
                    </div>
                    <div class="bg-light border rounded px-3 py-2">
                        <div class="typing-indicator"><span></span><span></span><span></span></div>
                    </div>
                </div>`;
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
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }

    new ChatBot();
});