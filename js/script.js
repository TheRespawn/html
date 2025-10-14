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
// --- SHOP PAGE SCRIPT ---
    // This entire block runs only if it finds the '.shop-section' on the page.
    const shopSection = document.querySelector('.shop-section');
    if (shopSection) {
        const partsContainer = document.getElementById('parts-container');
        const categoryFiltersContainer = document.getElementById('category-filters');
        const loadingMessage = document.getElementById('loading-message');
        const noPartsMessage = document.getElementById('no-parts-message');
        
        const API_URL = 'http://localhost:3000/api/v1/tuning-parts';

        /**
         * Creates the HTML for a single part card.
         * @param {object} part - The part data object from the API.
         * @returns {string} The HTML string for the part card.
         */
// REPLACE the existing createPartCardHTML function with this new version

        const createPartCardHTML = (part) => {
            let stockStatus = 'in-stock';
            let stockText = 'In Stock';

            if (part.stock_quantity === 0) {
                stockStatus = 'out-of-stock';
                stockText = 'Out of Stock';
            } else if (part.stock_quantity <= 5) {
                stockStatus = 'low-stock';
                stockText = `Low Stock (${part.stock_quantity} left)`;
            }

            // NEW: Check for a bestseller flag from the database
            const bestsellerBadge = part.is_bestseller ? '<div class="card-badge">Best Seller</div>' : '';

            // NEW: Use a real image URL from the database, with a fallback
            const imageUrl = part.image_url || `https://via.placeholder.com/400x300.png/1a1a1a/FF6600?text=${part.part_name.replace(' ', '+')}`;

            const priceFormatter = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR'
            });

            return `
                <div class="part-card" data-category="${part.category}" data-aos="zoom-in-up">
                    ${bestsellerBadge}
                    <div class="part-card-image-container">
                        <img src="${imageUrl}" alt="${part.part_name}" class="part-card-image">
                    </div>
                    <div class="part-card-content">
                        <p class="part-category">${part.category}</p>
                        <h3 class="part-name">${part.part_name}</h3>
                        <div class="part-card-footer">
                            <p class="part-price">${priceFormatter.format(part.price)}</p>
                            <p class="part-stock ${stockStatus}">${stockText}</p>
                        </div>
                        <button class="btn cta-button">View Details</button>
                    </div>
                </div>
            `;
        };
        
        /**
         * Renders the part cards into the container.
         * @param {Array<object>} parts - An array of part objects.
         */
        const renderParts = (parts) => {
            if (parts.length === 0) {
                noPartsMessage.style.display = 'block';
                partsContainer.innerHTML = '';
            } else {
                noPartsMessage.style.display = 'none';
                partsContainer.innerHTML = parts.map(createPartCardHTML).join('');
            }
        };

        /**
         * Extracts unique categories and populates the filter options.
         * @param {Array<object>} parts - An array of part objects.
         */
        const populateFilters = (parts) => {
            const categories = [...new Set(parts.map(p => p.category))];
            categoryFiltersContainer.innerHTML += categories.map(cat => `
                <label><input type="radio" name="category" value="${cat}"> ${cat}</label>
            `).join('');
        };
        
        /**
         * Sets up the event listener for the category filter radio buttons.
         */
        const setupFiltering = () => {
            categoryFiltersContainer.addEventListener('change', (e) => {
                if (e.target.name === 'category') {
                    const selectedCategory = e.target.value;
                    const allCards = document.querySelectorAll('.part-card');
                    let visibleCards = 0;

                    allCards.forEach(card => {
                        if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                            card.style.display = 'flex'; // Use 'flex' as the card is a flex container
                            visibleCards++;
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    // Show or hide the "no parts" message based on filter results
                    noPartsMessage.style.display = visibleCards === 0 ? 'block' : 'none';
                }
            });
        };

        /**
         * The main function to initialize the shop page.
         */
// REPLACE your existing initializeShop function with this one
        const initializeShop = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.success && data.parts) {
                    allParts = data.parts; // Store the fetched parts
                    renderParts(allParts);
                    populateFilters(allParts);
                    setupFiltering();
                    setupControls(); // NEW: Call the function to setup controls
                } else {
                    throw new Error('API returned unsuccessful response.');
                }

            } catch (error) {
                console.error("Failed to fetch or render shop parts:", error);
                partsContainer.innerHTML = `<p class="no-parts" style="display: block;">Error: Could not load parts. Please try again later.</p>`;
            } finally {
                loadingMessage.style.display = 'none';
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }
        };

        // ADD this entire new function to script.js inside the shop block

        /**
         * Sets up event listeners for the sort and view controls.
         */
        const setupControls = () => {
            const sortSelect = document.getElementById('sort-select');
            const gridViewBtn = document.getElementById('grid-view-btn');
            const listViewBtn = document.getElementById('list-view-btn');

            // Logic for the sort dropdown
            sortSelect.addEventListener('change', () => {
                const sortBy = sortSelect.value;
                // NOTE: This sorts all items. The category filter will be reset.
                // This is a simple and robust initial implementation.
                document.querySelector('#category-filters input[value="all"]').checked = true;

                let sortedParts = [...allParts]; // Make a copy to sort

                switch (sortBy) {
                    case 'price-asc':
                        sortedParts.sort((a, b) => a.price - b.price);
                        break;
                    case 'price-desc':
                        sortedParts.sort((a, b) => b.price - a.price);
                        break;
                    case 'name-asc':
                        sortedParts.sort((a, b) => a.part_name.localeCompare(b.part_name));
                        break;
                    // 'default' case needs no sorting, it's the original order from the DB
                }
                renderParts(sortedParts);
            });

            // Logic for the Grid/List view toggle buttons
            gridViewBtn.addEventListener('click', () => {
                partsContainer.classList.remove('list-view');
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
            });

            listViewBtn.addEventListener('click', () => {
                partsContainer.classList.add('list-view');
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
            });
        };

        // Run the initialization function
        initializeShop();
    }
}); // End of DOMContentLoaded