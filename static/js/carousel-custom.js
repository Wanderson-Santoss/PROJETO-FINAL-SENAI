document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel-custom');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.img-slide'));
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    let currentIndex = 4; // Índice inicial, deve ser o do slide com 'destaque-mid'
    let slideWidth = 0; 
    const GAP = 20; // Deve ser igual ao definido no CSS: gap: 20px;
    
    let autoplayInterval; // Variável para armazenar o ID do intervalo do autoplay
    const AUTOPLAY_TIME = 4000; // Tempo em milissegundos (4 segundos)

    // --- Funções de Cálculo e Movimento ---

    const getSlideWidth = () => {
        const baseSlide = slides.find(slide => !slide.classList.contains('destaque-mid')) || slides[0];
        if (baseSlide) {
            slideWidth = baseSlide.offsetWidth;
        } else {
            // Valor de fallback para o CSS padrão
            slideWidth = 250; 
        }
        return slideWidth;
    };

    const updateCarousel = () => {
        getSlideWidth(); 

        const centerOffset = carousel.offsetWidth / 2;
        
        let targetX = 0;
        for (let i = 0; i < currentIndex; i++) {
            targetX += getSlideWidth() + GAP;
        }
        
        const destaqueWidth = slides[currentIndex].offsetWidth; 
        const newTransformValue = targetX + (destaqueWidth / 2) - centerOffset;

        track.style.transform = `translateX(${-newTransformValue}px)`;

        // Gerencia a classe de destaque (CSS)
        slides.forEach((slide, index) => {
            slide.classList.remove('destaque-mid');
        });
        slides[currentIndex].classList.add('destaque-mid');
    };

    // --- Funções de Navegação com LOOP ---
    
    const moveToNextSlide = () => {
        // Implementa o LOOP para o próximo slide
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    };

    const moveToPrevSlide = () => {
        // Implementa o LOOP para o slide anterior
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateCarousel();
    };

    // --- Funções de Autoplay ---

    const startAutoplay = () => {
        // Limpa qualquer intervalo existente antes de iniciar um novo
        stopAutoplay();
        
        // Configura um novo intervalo para mover para o próximo slide
        autoplayInterval = setInterval(moveToNextSlide, AUTOPLAY_TIME);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    // --- Inicialização e Listeners ---

    // Função para resetar o timer do autoplay após interação manual
    const resetAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };
    
    // 1. Adiciona Listeners de Clique
    prevButton.addEventListener('click', () => {
        moveToPrevSlide();
        resetAutoplay(); // Reinicia o timer após clique manual
    });
    nextButton.addEventListener('click', () => {
        moveToNextSlide();
        resetAutoplay(); // Reinicia o timer após clique manual
    });
    
    // 2. Adiciona Pausa ao Passar o Mouse (Boa Prática de UX)
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // 3. Atualiza na Inicialização
    window.addEventListener('resize', updateCarousel);
    
    // 4. Inicia o carrossel e o autoplay
    updateCarousel(); 
    startAutoplay(); 
});