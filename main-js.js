// FreightMind - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('overflow-hidden');
        });
    }
    
    // Form submission handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Demo section functionality
    const demoButton = document.querySelector('#demo button');
    if (demoButton) {
        demoButton.addEventListener('click', function() {
            // This would typically launch an interactive demo or redirect to a demo page
            alert('Full interactive demo coming soon! Check back for updates.');
        });
    }
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-fadeIn');
            }
        });
    };
    
    // Add animation class to elements
    document.querySelectorAll('section > div > h2').forEach(heading => {
        heading.classList.add('animate-on-scroll');
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial check for elements in view
    animateOnScroll();
    
    // Add hover effects to feature cards
    document.querySelectorAll('#features > div > div').forEach(card => {
        card.classList.add('hover-lift');
    });
});

// Product demo simulator for the "Try Demo" button in hero section
function launchDemo() {
    const demoContainer = document.createElement('div');
    demoContainer.className = 'fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50';
    demoContainer.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full max-h-90vh overflow-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">FreightMind Demo</h2>
                <button id="close-demo" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 class="text-xl font-medium mb-2">Interactive Demo Coming Soon</h3>
                <p class="text-gray-600 mb-6">We're preparing an interactive demo of the FreightMind packaging optimization software.</p>
                <p class="text-gray-600">In the meantime, you can schedule a personalized demo with our team.</p>
                <button class="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Schedule Personalized Demo</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(demoContainer);
    document.body.classList.add('overflow-hidden');
    
    document.getElementById('close-demo').addEventListener('click', function() {
        document.body.removeChild(demoContainer);
        document.body.classList.remove('overflow-hidden');
    });
}

// Connect the hero section demo button
document.addEventListener('DOMContentLoaded', function() {
    const tryDemoButton = document.querySelector('.py-12.bg-gradient-to-r button:first-child');
    if (tryDemoButton) {
        tryDemoButton.addEventListener('click', launchDemo);
    }
});
