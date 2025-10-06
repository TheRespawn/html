// Wait for the entire HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION SCRIPT ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('nav-open')) {
                mainNav.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // --- PROJECT FILTER SCRIPT ---
    const filterContainer = document.querySelector('.filter-bar');

    if (filterContainer) {
        // --- 1. INITIALIZE THE LIGHTBOX ONCE ---
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true
        });

        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterContainer.addEventListener('click', (e) => {
            if (!e.target.classList.contains('filter-btn')) {
                return;
            }

            filterButtons.forEach(button => {
                button.classList.remove('active');
            });
            e.target.classList.add('active');

            const filterValue = e.target.dataset.filter;
            
            projectCards.forEach(card => {
                const cardCategory = card.dataset.category;
                if (filterValue === 'all' || cardCategory.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            // --- 2. TELL THE LIGHTBOX TO REFRESH (Pro-Tip!) ---
            lightbox.reload();
        });
    }

    // --- SCROLL TO TOP BUTTON SCRIPT ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        };

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

}); // This is the closing bracket and parenthesis for the DOMContentLoaded listener