document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Animaciones de Scroll (Fade in up)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animamos solo una vez
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-scroll');
    fadeElements.forEach(el => observer.observe(el));


    // 2. Efecto Tilt 3D ultra-premium en las tarjetas de productos
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calcula la posición del cursor relativa a la tarjeta
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calcula la rotación (centro = 0, bordes = max rotación)
            // Multiplicador ajusta la intensidad del efecto 3D
            const xRotation = ((y - rect.height / 2) / rect.height) * -20; 
            const yRotation = ((x - rect.width / 2) / rect.width) * 20;

            // Aplica la transformación
            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
        });

        // Restaura la tarjeta al sacar el cursor
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease-out';
        });
    });

    // 3. Efecto Glass Navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 12, 0.8)';
            navbar.style.borderBottom = '1px solid rgba(0, 240, 255, 0.2)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'var(--bg-glass)';
            navbar.style.borderBottom = '1px solid var(--border-glass)';
            navbar.style.boxShadow = 'none';
        }
    });

});