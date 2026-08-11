/* ============================================================
   PORTFOLIO — MAIN SCRIPT
   Naga Sai Balam
   ============================================================ */

'use strict';

// ==================== REDUCED MOTION CHECK ====================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function applyTheme(theme) {
  if (theme === 'light') {
    body.classList.add('light-mode');
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    if (icon) {
      icon.className = 'fas fa-sun';
    }
  } else {
    body.classList.remove('light-mode');
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    if (icon) {
      icon.className = 'fas fa-moon';
    }
  }
}

// Load saved theme — default is dark
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.contains('light-mode');
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.querySelector('.navbar');

function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ==================== ACTIVE NAV LINK ====================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'true');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();

// ==================== MOBILE MENU ====================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinksEl = document.getElementById('navLinks');

function closeMobileMenu() {
  if (!navLinksEl) return;
  navLinksEl.classList.remove('active');
  if (mobileMenuToggle) {
    mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }
}

if (mobileMenuToggle && navLinksEl) {
  mobileMenuToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      navLinksEl.classList.add('active');
      mobileMenuToggle.querySelector('i').className = 'fas fa-times';
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
  });

  // Close on nav link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 64;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({
        top: targetPos,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  });
});

// ==================== SCROLL REVEAL ====================
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);

          // Trigger counter animation when about section reveals
          if (entry.target.querySelector && entry.target.querySelector('.stat-number')) {
            animateCounters();
          }
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Also trigger counters if the stat-card parent is revealed
  const statGridObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statGridObserver.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) statGridObserver.observe(statsGrid);

} else {
  // If reduced motion, just make everything visible immediately
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// ==================== ANIMATED COUNTERS ====================
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated || prefersReducedMotion) {
    // If reduced motion or already run, just set final values
    document.querySelectorAll('.stat-number').forEach(counter => {
      counter.textContent = counter.getAttribute('data-target');
    });
    countersAnimated = true;
    return;
  }
  countersAnimated = true;

  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

function showMessage(message, type) {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  // Clear after 6 seconds
  setTimeout(() => {
    formMessage.className = 'form-message';
    formMessage.textContent = '';
  }, 6000);
}

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('#form-submit');
    const btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
    const originalText = btnSpan ? btnSpan.textContent : 'Send Message';

    // Collect values
    const nameInput = this.querySelector('#form-name');
    const emailInput = this.querySelector('#form-email');
    const messageInput = this.querySelector('#form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Validate
    if (!name) {
      showMessage('Please enter your name.', 'error');
      if (nameInput) nameInput.focus();
      return;
    }
    if (!email) {
      showMessage('Please enter your email address.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }
    if (!message) {
      showMessage('Please write your message.', 'error');
      if (messageInput) messageInput.focus();
      return;
    }

    // Loading state
    if (submitBtn) submitBtn.disabled = true;
    if (btnSpan) btnSpan.textContent = 'Sending…';

    try {
      // Simulate submission — replace with your API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', { name, email, message });
      showMessage(`Thanks, ${name}! Your message has been received. I'll get back to you soon.`, 'success');
      this.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage('Something went wrong. Please email me directly at nagasaibalam@gmail.com', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnSpan) btnSpan.textContent = originalText;
    }
  });
}

// ==================== PROJECTS SLIDER (AUTOMATIC & MANUAL CONTINUOUS SLIDE) ====================
const projectsWrapper = document.getElementById('projectsSliderWrapper');
const projectsTrack = document.getElementById('projectsSliderTrack');

if (projectsWrapper && projectsTrack) {
  // Duplicate cards for seamless infinite loop
  projectsTrack.innerHTML += projectsTrack.innerHTML;

  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let isHovered = false;
  let slideSpeed = 0.6; // px per frame for slow left-to-right sliding

  function autoSlide() {
    if (!isDown && !isHovered) {
      projectsWrapper.scrollLeft += slideSpeed;
    }

    // Seamless infinite loop reset
    const halfWidth = projectsTrack.scrollWidth / 2;
    if (halfWidth > 0) {
      if (projectsWrapper.scrollLeft >= halfWidth) {
        projectsWrapper.scrollLeft -= halfWidth;
      } else if (projectsWrapper.scrollLeft <= 0) {
        projectsWrapper.scrollLeft += halfWidth;
      }
    }

    requestAnimationFrame(autoSlide);
  }

  requestAnimationFrame(autoSlide);

  // Mouse hover events
  projectsWrapper.addEventListener('mouseenter', () => {
    isHovered = true;
  });
  
  projectsWrapper.addEventListener('mouseleave', () => {
    isHovered = false;
    isDown = false;
    projectsWrapper.classList.remove('is-dragging');
  });

  // Mouse Drag (Manual Control)
  projectsWrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    projectsWrapper.classList.add('is-dragging');
    startX = e.pageX - projectsWrapper.offsetLeft;
    scrollLeftStart = projectsWrapper.scrollLeft;
  });

  projectsWrapper.addEventListener('mouseup', () => {
    isDown = false;
    projectsWrapper.classList.remove('is-dragging');
  });

  projectsWrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - projectsWrapper.offsetLeft;
    const walk = (x - startX) * 1.5;
    projectsWrapper.scrollLeft = scrollLeftStart - walk;
  });

  // Touch Handling (Mobile Manual Control)
  projectsWrapper.addEventListener('touchstart', () => {
    isHovered = true;
  }, { passive: true });

  projectsWrapper.addEventListener('touchend', () => {
    isHovered = false;
  }, { passive: true });
}

// ==================== INIT ====================
console.log('Portfolio loaded — Naga Sai Balam');

