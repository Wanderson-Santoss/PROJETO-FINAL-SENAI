document.addEventListener('DOMContentLoaded', function() {
    
    // ====================== CARROSSEL PERSONALIZADO ======================
    const track = document.querySelector('.carousel-track');
    let slides = Array.from(document.querySelectorAll('.img-slide'));
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    // Inicializa com o índice da primeira imagem real, ignorando as clonadas
    let currentIndex = 2; // O índice 2 é a primeira imagem original (Pedreiro)

    function updateCarousel() {
        // Remove destaque de todas as imagens
        slides.forEach(slide => {
            slide.classList.remove('destaque-mid');
        });
        
        // Adiciona destaque à imagem central (ajustado para a primeira imagem real)
        slides[currentIndex].classList.add('destaque-mid');

        // Calcula o offset para centralizar a imagem do meio
        const containerWidth = track.parentElement.offsetWidth;
        const middleImage = slides[currentIndex];
        const middleImageWidth = middleImage.offsetWidth;
        const totalPreviousWidth = slides.slice(0, currentIndex).reduce((acc, img) => acc + img.offsetWidth, 0);
        const totalPreviousMargin = currentIndex * 15; // 15px de gap

        const offset = (containerWidth / 2) - (middleImageWidth / 2) - totalPreviousWidth - totalPreviousMargin;
        track.style.transform = `translateX(${offset}px)`;
    }

    function handleNext() {
        currentIndex++;
        updateCarousel();
        // Se estiver no final das imagens originais, volta para o início
        if (currentIndex > slides.length - 3) { // Ex: 10 imgs -> 12 no total. Se chegou no índice 9 (2ª dupl.), volta para 2
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = 2;
                updateCarousel();
            }, 600); // tempo da transição
            // Adiciona a transição de volta depois de um pequeno atraso
            setTimeout(() => {
                track.style.transition = 'transform 0.6s ease-in-out';
            }, 700);
        }
    }
    
    function handlePrev() {
        currentIndex--;
        updateCarousel();
        // Se estiver no início das imagens originais, vai para o final
        if (currentIndex < 2) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = slides.length - 3;
                updateCarousel();
            }, 600); // tempo da transição
            setTimeout(() => {
                track.style.transition = 'transform 0.6s ease-in-out';
            }, 700);
        }
    }

    nextButton.addEventListener('click', handleNext);
    prevButton.addEventListener('click', handlePrev);

    // Inicia o carrossel na posição correta
    updateCarousel();

    // Adiciona um evento para recalcular a posição em redimensionamentos de tela
    window.addEventListener('resize', updateCarousel);
    
    // Adiciona o carrossel automático
    setInterval(handleNext, 3000); // Roda a função handleNext a cada 3 segundos



    // ... (o restante do seu código JavaScript)

function handleNext() {
    currentIndex++;
    updateCarousel();
    // Se estiver no final das imagens originais, volta para o início
    if (currentIndex > slides.length - 3) {
        setTimeout(() => {
            track.style.transition = 'none';
            currentIndex = 2;
            updateCarousel();
        }, 600);
        // Adiciona a transição de volta depois de um pequeno atraso
        setTimeout(() => {
            track.style.transition = 'transform 0.6s ease-in-out';
        }, 700);
    }
}

function handlePrev() {
    currentIndex--;
    updateCarousel();
    // Se estiver no início das imagens originais, vai para o final
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

    const showLoginBtn = document.getElementById('showLoginBtn');
    const showCadastroBtn = document.getElementById('showCadastroBtn');
    if (showLoginBtn) showLoginBtn.addEventListener('click', showLogin);
    if (showCadastroBtn) showCadastroBtn.addEventListener('click', showCadastro);

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