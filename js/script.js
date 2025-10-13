document.addEventListener('DOMContentLoaded', () => {

    // --- PAGE TRANSITION SCRIPT (with bfcache fix) ---
    // This function handles fading out the overlay to show the page content
    function showPage() {
        const transitionOverlay = document.querySelector('.page-transition-overlay');
        if (transitionOverlay) {
            transitionOverlay.classList.add('is-hidden');
        }
        // After the page is visible, refresh AOS to trigger animations for elements already in view
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 400); // This duration must match the CSS transition duration
    }

    // Run the showPage function on the initial page load
    window.addEventListener('load', showPage);

    // Run the showPage function again if a page is restored from the browser's back/forward cache
    window.addEventListener('pageshow', (event) => {
        // event.persisted is true if the page was restored from the bfcache
        if (event.persisted) {
            showPage();
        }
    });

    // This function handles fading in the overlay when a user clicks a link
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Check if it's a link we should apply transitions to
        const isInternalLink = link.href.startsWith(window.location.origin) || link.href.startsWith('.');
        const isNewTab = link.target === '_blank';
        const isHashLink = link.href.includes('#');

        if (isInternalLink && !isNewTab && !isHashLink) {
            e.preventDefault(); // Stop the browser from navigating instantly
            const destinationUrl = link.href;
            const transitionOverlay = document.querySelector('.page-transition-overlay');
            
            if (transitionOverlay) {
                transitionOverlay.classList.remove('is-hidden'); // Fade the overlay IN
            }
            
            // Navigate to the new page after the overlay has covered the screen
            setTimeout(() => {
                window.location.href = destinationUrl;
            }, 400); // Match the CSS transition duration
        }
    });


    // --- THEME TOGGLE SCRIPT ---
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }

    // --- INITIALIZE LIBRARIES ---
    // Initialize Animate on Scroll (AOS)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Initialize Cookie Consent Banner
    if (typeof cookieconsent !== 'undefined') {
        cookieconsent.initialise({
            "palette": {
                "popup": { "background": "#1a1a1a", "text": "#E5E5E5" },
                "button": { "background": "#FF6600", "text": "#FFFFFF" }
            },
            "theme": "floating",
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
            onStatusChange: function(status) {
                if (this.hasConsented()) {
                    console.log("Consent given. Non-essential scripts can now be loaded.");
                }
            },
            onInitialise: function(status) {
                if (this.hasConsented()) {
                    console.log("Consent already given. Loading non-essential scripts.");
                }
            }
        });
    }

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
    if (filterContainer && typeof GLightbox !== 'undefined') {
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