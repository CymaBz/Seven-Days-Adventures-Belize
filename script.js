document.addEventListener('DOMContentLoaded', function () {

    // 0. Handle Hamburger Menu
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }


    // 1. Initialize the Tour Slider
    if (document.getElementById('tour-slider')) {
        new Splide('#tour-slider', {
            type       : 'loop',
            perPage    : 4,
            perMove    : 1,
            gap        : 'var(--grid-gutter)',
            autoplay   : true,
            interval   : 4000, // Time in milliseconds between slides
            pauseOnHover: true,
            resetProgress: false,
            pagination : true,
            arrows     : true,
            breakpoints: {
                1200: {
                    perPage: 3,
                },
                992: {
                    perPage: 2,
                },
                768: {
                    perPage: 1,
                    arrows: false,
                },
            },
        }).mount();
    }

    // 2. Handle Modal Logic
    const modal = document.getElementById('tour-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const bookingModal = document.getElementById('booking-modal');
    const bookingModalCloseBtn = document.getElementById('booking-modal-close');
    const bookingForm = document.getElementById('booking-form');
    const tourCards = document.querySelectorAll('.tour-card');

    // Define modal functions in a higher scope to be accessible by both sections
    const openBookingModal = (card) => {
        const tourSelect = document.getElementById('tour-selection');
        if (card && tourSelect) {
            tourSelect.value = card.dataset.title;
        } else if (tourSelect) {
            tourSelect.value = ""; // Reset if no card is passed
        }
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            setTimeout(() => bookingModal.classList.add('visible'), 10);
        }
    };

    const closeBookingModal = () => {
        if (bookingModal) {
            bookingModal.classList.remove('visible');
            setTimeout(() => bookingModal.style.display = 'none', 300);
        }
    };


    // --- Details Modal ---
    if (modal && modalCloseBtn && tourCards.length > 0) { 
        
        const modalBookNowBtn = document.getElementById('modal-book-now');
        // Function to open the modal
        const openDetailsModal = (card) => {
            document.getElementById('modal-title').textContent = card.dataset.title;
            // document.getElementById('modal-price').textContent = card.dataset.price; // Price hidden from details modal
            document.getElementById('modal-description').textContent = card.dataset.description;
            document.getElementById('modal-itinerary').textContent = card.dataset.itinerary;
            document.getElementById('modal-difficulty').textContent = card.dataset.difficulty;
            document.getElementById('modal-included').textContent = card.dataset.included.split(', ').join('\n');
            document.getElementById('modal-not-included').textContent = card.dataset.notIncluded.split(', ').join('\n');
            document.getElementById('modal-bring').textContent = card.dataset.bring.split(', ').join('\n');
            
            // Store a reference to the current card on the modal itself
            modal.currentCard = card;

            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('visible'), 10); // For transition
        };

        // Function to close the modal
        const closeDetailsModal = () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.style.display = 'none', 300); // Match transition duration
        };

        // Add click listeners to all tour cards
        tourCards.forEach(card => {
            // Open details modal if the card itself (but not the book button) is clicked
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('card-book-now')) {
                    openDetailsModal(card);
                }
            });
        });

        // Add click listeners for closing the modal
        modalCloseBtn.addEventListener('click', closeDetailsModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDetailsModal(); // Close if overlay is clicked
        });

        // Add click listener for the "Book Now" button inside the details modal
        if (modalBookNowBtn) {
            modalBookNowBtn.addEventListener('click', () => {
                if (modal.currentCard) {
                    closeDetailsModal();
                    setTimeout(() => openBookingModal(modal.currentCard), 300); // Open booking modal after details modal closes
                }
            });
        }
    }

    // --- Booking Modal ---
    if (bookingModal && bookingModalCloseBtn && tourCards.length > 0) {
        const tourSelect = document.getElementById('tour-selection');

        // Populate the tour selection dropdown
        if (tourSelect) {
            tourCards.forEach(card => {
                const option = document.createElement('option');
                option.value = card.dataset.title;
                option.textContent = card.dataset.title;
                tourSelect.appendChild(option);
            });
        }

        document.querySelectorAll('.card-book-now').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents the details modal from opening
                const card = e.target.closest('.tour-card');
                openBookingModal(card);
            });
        });

        bookingModalCloseBtn.addEventListener('click', closeBookingModal);
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBookingModal();
        });

    }

    // 3. Handle Destination Page Tabbed Navigation
    const destNavLinks = document.querySelectorAll('.dest-nav-link');
    const destContents = document.querySelectorAll('.destination-content');

    if (destNavLinks.length > 0) {
        const sliders = {};

        // Function to initialize a slider
        const initSlider = (selector) => {
            const element = document.querySelector(selector);
            if (element && !sliders[selector]) { // Only init if it exists and not already initialized
                sliders[selector] = new Splide(selector, {
                    type      : 'loop',   // Use 'loop' for continuous sliding
                    autoplay  : true,     // Enable autoplay
                    interval  : 5000,     // Set interval to 5 seconds
                    perPage   : 1,
                    perMove   : 1,
                    pagination: false, // No dots needed for a banner
                    arrows    : true,
                    height    : '450px',
                }).mount();
            }
        };

        // Initialize the first visible slider
        initSlider('#snorkelling-slider');

        // Handle tab switching
        destNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.dataset.target;
                const targetContent = document.getElementById(targetId);

                // Update active classes
                destNavLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
                destContents.forEach(content => content.classList.remove('active'));
                if (targetContent) {
                    targetContent.classList.add('active');

                    // Initialize the slider for the now-visible tab
                    const sliderSelector = `#${targetId}-slider`;
                    initSlider(sliderSelector);

                    // Refresh the slider dimensions if it was already initialized
                    if (sliders[sliderSelector]) {
                        sliders[sliderSelector].refresh();
                    }
                }
            });
        });
    }

    // 4. Handle Booking Confirmation Logic (moved from previous attempt)
    const confirmationModal = document.getElementById('confirmation-modal');
    if (bookingForm && confirmationModal) {
        const confirmationModalCloseBtn = document.getElementById('confirmation-modal-close');
        const editBookingBtn = document.getElementById('edit-booking');
        const confirmAndSendBtn = document.getElementById('confirm-and-send');

        const openConfirmationModal = () => {
            confirmationModal.style.display = 'flex';
            setTimeout(() => confirmationModal.classList.add('visible'), 10);
        };

        const closeConfirmationModal = () => {
            confirmationModal.classList.remove('visible');
            setTimeout(() => confirmationModal.style.display = 'none', 300);
        };

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the form from submitting immediately

            // 1. Get data from the booking form
            const tourTitle = document.getElementById('tour-selection').value;
            const pax = parseInt(document.getElementById('pax').value, 10);
            const date = document.getElementById('tour-date').value;
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;

            // 2. Find the tour card to get pricing info
            const tourCard = Array.from(tourCards).find(card => card.dataset.title === tourTitle);
            if (!tourCard) {
                alert('Could not find tour details. Please re-select the tour.');
                return;
            }

            const priceString = tourCard.dataset.price; // e.g., "$650 USD"
            const priceValue = parseFloat(priceString.replace(/[^0-9.-]+/g,""));
            const pricingModel = tourCard.querySelector('.card-meta').textContent; // "Per Person" or "Private Tour..."

            let totalPrice = priceValue;
            if (pricingModel.includes('Per Person')) {
                totalPrice = priceValue * pax;
            }

            // 3. Populate the confirmation modal
            document.getElementById('conf-tour').textContent = tourTitle;
            document.getElementById('conf-date').textContent = date;
            document.getElementById('conf-pax').textContent = pax;
            document.getElementById('conf-name').textContent = `${firstName} ${lastName}`;
            document.getElementById('conf-email').textContent = email;
            document.getElementById('conf-price').textContent = `$${totalPrice.toFixed(2)} USD`;

            // 4. Show the confirmation modal
            closeBookingModal();
            setTimeout(openConfirmationModal, 350); // Open after booking modal has closed
        });

        // --- Event Listeners for Confirmation Modal ---

        // "Confirm & Send" button
        confirmAndSendBtn.addEventListener('click', () => {
            // Here you would typically send the data to a server.
            // For now, we'll just simulate it with an alert and close the modals.
            alert('Booking request sent successfully! We will contact you shortly to confirm.');
            closeConfirmationModal();
            bookingForm.reset(); // Clear the form for the next booking
        });

        // "Edit Details" button
        editBookingBtn.addEventListener('click', () => {
            closeConfirmationModal();
            setTimeout(() => openBookingModal(null), 350); // Re-open the booking form
        });
        confirmationModalCloseBtn.addEventListener('click', closeConfirmationModal);
    }

});