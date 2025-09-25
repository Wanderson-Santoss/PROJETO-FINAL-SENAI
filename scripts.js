document.addEventListener('DOMContentLoaded', function() {
    const productGallery = document.getElementById('productGallery');
    const galleryPagination = document.getElementById('galleryPagination');

    // Define your galleries. Each sub-array is a page of images.
    const galleries = [
        [ // Gallery 1 (6 photos)
            'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg',
            'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg'
        ],
        [ // Gallery 2 (6 photos)
            // IMPORTANT: Replace these with actual paths to your 6 new images
            'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg',
            'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg'
        ]
        // Add more galleries here as needed, e.g.,
        // [ // Gallery 3 (e.g., 6 photos)
        //     'Bolos/bolo13.jpg', 'Bolos/bolo14.jpg', 'Bolos/bolo15.jpg',
        //     'Bolos/bolo16.jpg', 'Bolos/bolo17.jpg', 'Bolos/bolo18.jpg'
        // ]
    ];

    let currentGalleryIndex = 0; // Start at the first gallery (index 0)

    function renderGallery(index) {
        productGallery.innerHTML = ''; // Clear current images

        const imagesToLoad = galleries[index];
        if (!imagesToLoad) {
            console.error("Gallery not found for index:", index);
            return;
        }

        imagesToLoad.forEach(imagePath => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-4'; // 3 photos per row
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = 'Bolo'; // You might want more specific alt text
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

        // Set active class for the current page number
        const currentPageItem = galleryPagination.querySelector(`[data-page="${activeIndex + 1}"]`);
        if (currentPageItem) {
            currentPageItem.classList.add('active');
        }

        // Handle arrow button disabled state
        const prevArrow = galleryPagination.querySelector('[data-page="prev"]');
        const nextArrow = galleryPagination.querySelector('[data-page="next"]');

        if (prevArrow) {
            prevArrow.classList.toggle('disabled', activeIndex === 0);
        }
        if (nextArrow) {
            nextArrow.classList.toggle('disabled', activeIndex === galleries.length - 1);
        }
    }

    // Event listener for pagination clicks
    galleryPagination.addEventListener('click', function(event) {
        const target = event.target.closest('.page-item');
        if (!target || target.classList.contains('active') || target.classList.contains('disabled')) {
            return; // Do nothing if already active or disabled or not a page item
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
            // It's a page number
            const pageNumber = parseInt(pageData);
            if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= galleries.length) {
                currentGalleryIndex = pageNumber - 1; // Convert to 0-based index
                renderGallery(currentGalleryIndex);
            }
        }
    });

    // Initial render of the first gallery
    renderGallery(currentGalleryIndex);
});










//              TRANSIÇÃO DE LOGIN PARA CADASTRO



function showLogin() {
    document.getElementById('cadastroForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginForm').classList.add('fade-in');
}

function showCadastro() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('cadastroForm').style.display = 'block';
    document.getElementById('cadastroForm').classList.add('fade-in');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
    alert(`Login realizado com sucesso!\nE-mail: ${email}`);
}

function handleCadastro(event) {
    event.preventDefault();
    const email = document.getElementById('cadastroEmail').value;
    const telefone = document.getElementById('cadastroTelefone').value;
    alert(`Cadastro realizado com sucesso!\nE-mail: ${email}\nTelefone: ${telefone}`);
}

function clearLoginForm() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginSenha').value = '';
}

function clearCadastroForm() {
    document.getElementById('cadastroEmail').value = '';
    document.getElementById('cadastroSenha').value = '';
    document.getElementById('cadastroTelefone').value = '';
}













//                                CHAT ESTATICO


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
        this.bootstrapCollapse = new bootstrap.Collapse(document.getElementById('chatWidget'), { toggle: false });
    }

    bindEvents() {
        // Abrir chat
        document.querySelector('#supportButton button').addEventListener('click', () => this.openChat());

        // Fechar chat (X)
        document.querySelector('#chatWidget .btn-light').addEventListener('click', () => this.closeChat());

        // Enviar mensagem
        document.getElementById('sendMessage').addEventListener('click', () => this.sendUserMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendUserMessage();
        });
    }

    openChat() {
        this.bootstrapCollapse.show();
        setTimeout(() => this.addBotMessage("Olá! 👋 Bem-vindo ao nosso suporte! Como posso ajudá-lo hoje?"), 500);
        setTimeout(() => this.addBotMessage("Você pode me perguntar sobre nossos produtos, serviços ou qualquer dúvida que tiver!"), 1500);
    }

    closeChat() {
        this.bootstrapCollapse.hide();
        // Resetar mensagens do chat quando fechar
        setTimeout(() => {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '<div class="text-muted small">Inicie uma conversa...</div>';
            this.messageCount = 0;
        }, 300); // espera animação do collapse
    }

    sendUserMessage() {
        const input = document.getElementById('messageInput');
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
        const div = document.createElement('div');
        div.className = 'mb-4 fade-in';
        div.innerHTML = `<div class="d-flex justify-content-end"><div class="bg-primary text-white rounded px-3 py-2" style="max-width: 80%">${message}</div></div>`;
        document.getElementById('chatMessages').appendChild(div);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const div = document.createElement('div');
        div.className = 'mb-4 fade-in';
        div.innerHTML = `
            <div class="d-flex align-items-start mb-2">
                <div class="w-8 h-8 bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2">
                    <i class="bi bi-robot text-white"></i>
                </div>
                <div class="bg-light border rounded px-3 py-2" style="max-width: 80%">${message}</div>
            </div>`;
        document.getElementById('chatMessages').appendChild(div);
        this.scrollToBottom();
    }

    showTypingIndicator() {
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
        document.getElementById('chatMessages').appendChild(div);
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
        container.scrollTop = container.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => new ChatBot());