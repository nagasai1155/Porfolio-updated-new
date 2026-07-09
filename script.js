// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const favicon = document.getElementById('favicon');

// Function to update favicon based on theme
function updateFavicon(isLightMode) {
    if (favicon) {
        favicon.href = isLightMode ? 'favicon-light.svg' : 'favicon.svg';
    }
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    updateFavicon(true);
} else {
    updateFavicon(false);
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    const isLightMode = body.classList.contains('light-mode');
    
    if (isLightMode) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
        updateFavicon(true);
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
        updateFavicon(false);
    }
});

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== ACTIVE NAV LINK ON SCROLL ====================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink();

// ==================== MOBILE MENU ====================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Close menu when clicking on a link
if (navLinks) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== TERMINAL TYPING EFFECT ====================
const terminalLines = [
    { id: 'line-name', text: 'Naga Sai Balam', className: 'is-highlight' },
    { id: 'line-role', text: 'Full Stack Engineer', className: 'is-typed' },
    { id: 'line-focus', text: 'React · Next.js · Node.js — AI-integrated web apps', className: '' },
    { id: 'line-stat', text: '280 problems solved · 6 projects shipped', className: 'is-highlight' }
];

function typeText(element, text, className, speed = 28) {
    return new Promise((resolve) => {
        if (!element) {
            resolve();
            return;
        }

        let index = 0;
        element.textContent = '';
        if (className) element.classList.add(className);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            element.textContent = text;
            resolve();
            return;
        }

        function tick() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index += 1;
                setTimeout(tick, speed);
            } else {
                resolve();
            }
        }

        tick();
    });
}

async function runTerminalSequence() {
    for (const line of terminalLines) {
        const el = document.getElementById(line.id);
        await typeText(el, line.text, line.className);
        await new Promise((r) => setTimeout(r, 180));
    }
}

runTerminalSequence();

// ==================== SCROLL REVEAL ====================
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .section-header, .about-panel, .editor-panel').forEach((el) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    revealObserver.observe(el);
});

// ==================== ANIMATED COUNTERS ====================
function animateCounter(counter) {
    if (counter.dataset.animated === 'true') return;
    counter.dataset.animated = 'true';

    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    if (Number.isNaN(target)) return;

    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        counter.textContent = `${value}${progress >= 1 ? suffix : ''}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.textContent = `${target}${suffix}`;
        }
    }

    requestAnimationFrame(update);
}

const statsOutput = document.getElementById('statsOutput');
if (statsOutput) {
    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    statsOutput.querySelectorAll('.stat-number').forEach(animateCounter);
                    statsObserver.unobserve(statsOutput);
                }
            });
        },
        { threshold: 0.35 }
    );
    statsObserver.observe(statsOutput);
}

// File tree folder icon toggle
document.querySelectorAll('.filetree-folder').forEach((folder) => {
    const icon = folder.querySelector('.folder-icon');
    if (!icon) return;

    const updateIcon = () => {
        icon.textContent = folder.open ? '▾' : '▸';
    };

    folder.addEventListener('toggle', updateIcon);
    updateIcon();
});

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;
        
        // Get form data
        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const message = this.message.value.trim();
        
        // Validate
        if (!name || !email || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable button
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        
        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('Form submitted:', { name, email, message });
            
            showMessage(`Thank you ${name}! Your message has been received. I'll get back to you soon!`, 'success');
            this.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('Something went wrong. Please try again or email me directly.', 'error');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = originalText;
        }
    });
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

// ==================== INITIALIZE ====================
console.log('✨ Landing page loaded successfully!');

