document.addEventListener('DOMContentLoaded', () => {

    // --- PAGE TRANSITION SCRIPT (Overlay Method) ---
    const transitionOverlay = document.querySelector('.page-transition-overlay');

    // Fade out the overlay on page load
    // We use window.onload which waits for all content (like images) to be ready
    window.onload = () => {
        if (transitionOverlay) {
            transitionOverlay.classList.add('is-hidden');
        }
        // Refresh AOS after the page is visible to trigger animations
        setTimeout(() => {
            AOS.refresh();
        }, 400); // Match the CSS transition duration
    };

    // Intercept link clicks to fade in the overlay
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const isInternalLink = link.href.startsWith(window.location.origin) || link.href.startsWith('.');
        const isNewTab = link.target === '_blank';
        const isHashLink = link.href.includes('#');

        if (isInternalLink && !isNewTab && !isHashLink) {
            e.preventDefault();
            const destinationUrl = link.href;
            
            // Fade the overlay IN
            if (transitionOverlay) {
                transitionOverlay.classList.remove('is-hidden');
            }
            
            // Navigate after the overlay has covered the screen
            setTimeout(() => {
                window.location.href = destinationUrl;
            }, 400); // Match the CSS transition duration
        }
    });

    // --- INITIALIZE LIBRARIES ---
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    window.cookieconsent.initialise({
        "palette": {
            "popup": { "background": "#1a1a1a", "text": "#E5E5E5" },
            "button": { "background": "#FF6600", "text": "#FFFFFF" }
        },
        "theme": "floating",
        "position": "bottom-right",
        "type": "opt-in",
        "content": {
            "message": "Diese Website verwendet Cookies, um Ihnen ein optimales Erlebnis zu bieten. Wir nutzen Cookies zur Personalisierung von Inhalten und zur Analyse unseres Datenverkehrs.",
            "allow": "Alle akzeptieren",
            "deny": "Nur Notwendige",
            "link": "Mehr erfahren",
            "href": "datenschutz.html"
        },
        onPopupOpen: function() {
            let overlay = document.createElement('div');
            overlay.className = 'cookie-overlay';
            document.body.appendChild(overlay);
        },
        onPopupClose: function() {
            let overlay = document.querySelector('.cookie-overlay');
            if (overlay) {
                overlay.remove();
            }
        },
        onStatusChange: function(status, chosenBefore) {
            if (this.hasConsented()) { console.log("Consent given."); }
        },
        onInitialise: function(status) {
            if (this.hasConsented()) { console.log("Consent already given."); }
        }
    });

    // --- MOBILE NAVIGATION SCRIPT ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav && mainNav.classList.contains('nav-open')) {
                mainNav.classList.remove('nav-open');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // --- PROJECT FILTER & LIGHTBOX SCRIPT ---
    const filterContainer = document.querySelector('.filter-bar');
    if (filterContainer) {
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true
        });
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        filterContainer.addEventListener('click', (e) => {
            if (!e.target.classList.contains('filter-btn')) { return; }
            filterButtons.forEach(button => { button.classList.remove('active'); });
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

}); // End of DOMContentLoaded