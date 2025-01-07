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

    const contactForm = document.getElementById('contact-form');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupBtn = document.getElementById('close-popup');

    // Popup functionality
    function showPopup(name) {
        const popupContent = document.querySelector('.popup-content');
        const popupMessage = popupContent.querySelector('p');
        popupMessage.textContent = `Thank you ${name}! I'll get back to you soon.`;
        popupOverlay.style.display = 'flex';
    }

    function hidePopup() {
        console.log('Popup closed'); // Debugging log
        popupOverlay.style.display = 'none';
    }

    // Close popup only when close button is clicked
    closePopupBtn.addEventListener('click', hidePopup);

    // Remove unintended close logic
    popupOverlay.removeEventListener('click', hidePopup);

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
                const result = await response.json();
                // Show success popup with the sender's name
                showPopup(result.name);
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

    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        const sections = document.querySelectorAll('section');
        let found = false;

        sections.forEach(section => {
            if (section.innerText.toLowerCase().includes(query)) {
                section.scrollIntoView({ behavior: 'smooth' });
                section.classList.add('highlight');
                found = true;
            } else {
                section.classList.remove('highlight');
            }
        });

        if (!found && query.trim() !== '') {
            alert('No matches found!');
        }
    });

    // Light/Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Preserve theme on reload
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
});
