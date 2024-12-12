document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll-triggered animations
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupBtn = document.getElementById('close-popup');

    // Popup functionality
    function showPopup() {
        popupOverlay.style.display = 'flex';
    }

    function hidePopup() {
        popupOverlay.style.display = 'none';
    }

    // Close popup when close button is clicked
    closePopupBtn.addEventListener('click', hidePopup);

    // Close popup when clicking outside the popup content
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });

    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            // Send data to backend
            const response = await fetch('http://localhost:5000/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Show success popup
                showPopup();
                
                // Reset form
                contactForm.reset();
            } else {
                // Handle error response
                const errorData = await response.json();
                console.error('Submission error:', errorData);
                alert('There was an error submitting your message. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('There was a network error. Please check your connection and try again.');
        }
    });
});