// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Navigation Toggle (Mobile) =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===== Scroll Reveal Animation =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.experience-card, .project-card, .publication-card, .skill-category, .stat-card, .timeline-item');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize elements for reveal animation
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.experience-card, .project-card, .publication-card, .skill-category, .stat-card, .timeline-item');

    reveals.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });

    // Trigger initial check
    revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll);

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Typing Effect for Code Window =====
function typeCode() {
    const codeElement = document.querySelector('.code-content code');
    if (!codeElement) return;

    const originalHTML = codeElement.innerHTML;
    codeElement.innerHTML = '';

    let i = 0;
    const speed = 20;

    function type() {
        if (i < originalHTML.length) {
            // Handle HTML tags
            if (originalHTML.charAt(i) === '<') {
                const closingIndex = originalHTML.indexOf('>', i);
                codeElement.innerHTML += originalHTML.substring(i, closingIndex + 1);
                i = closingIndex + 1;
            } else {
                codeElement.innerHTML += originalHTML.charAt(i);
                i++;
            }
            setTimeout(type, speed);
        }
    }

    // Start typing when hero section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(type, 500);
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', typeCode);

// ===== Skill Tags Hover Effect =====
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });

    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ===== Contact Form (if added later) =====
function handleFormSubmit(event) {
    event.preventDefault();
    // Add form handling logic here
    alert('Thank you for your message! I will get back to you soon.');
}

// ===== Current Year for Footer =====
document.addEventListener('DOMContentLoaded', () => {
    const footerYear = document.querySelector('.footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
    }
});

// ===== Preloader (optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== Console Easter Egg =====
console.log('%c Hey there! 👋', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%c Thanks for checking out my portfolio!', 'font-size: 14px; color: #94a3b8;');
console.log('%c Feel free to reach out: renukaprasad.patwari@sjsu.edu', 'font-size: 12px; color: #10b981;');
