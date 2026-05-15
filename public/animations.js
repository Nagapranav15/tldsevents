// ============================================
// GOD-LEVEL ANIMATIONS CONTROLLER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all animations
  initScrollAnimations();
  initParallaxEffect();
  initMagneticButtons();
  initTiltEffect();
  initTypingEffect();
  initScrollProgress();
  initCounterAnimation();
  initSmoothReveal();
  initHoverEffects();
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
          const speed = el.dataset.speed || 0.5;
          const yPos = -(scrolled * speed);
          el.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ============================================
// 3D TILT EFFECT
// ============================================
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('.tilt');
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
}

// ============================================
// TYPING EFFECT
// ============================================
function initTypingEffect() {
  const typingElements = document.querySelectorAll('.typing-text');
  
  typingElements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    el.style.borderRight = '2px solid var(--accent)';
    
    let i = 0;
    const typeChar = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, 100);
      } else {
        el.style.animation = 'blink-caret 0.75s step-end infinite';
      }
    };
    
    // Start typing when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeChar, 500);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(el);
  });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

// ============================================
// SMOOTH REVEAL FOR HERO ELEMENTS
// ============================================
function initSmoothReveal() {
  // Add stagger animation to event cards
  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`;
  });
  
  // Add reveal animation to sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.classList.contains('hero')) {
      section.classList.add('reveal');
    }
  });
}

// ============================================
// HOVER EFFECTS ENHANCER
// ============================================
function initHoverEffects() {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('button, .btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.5);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ============================================
// CONFETTI EFFECT
// ============================================
function triggerConfetti() {
  const colors = ['#A280FF', '#7B68EE', '#fff', '#ff6b6b', '#4ade80'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 4000);
  }
}

// ============================================
// SKEW ON SCROLL EFFECT
// ============================================
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset;
  const scrollDirection = scrollTop > lastScrollTop ? 1 : -1;
  const scrollSpeed = Math.abs(scrollTop - lastScrollTop);
  const skewAmount = Math.min(scrollSpeed * 0.1, 5) * scrollDirection;
  
  const skewElements = document.querySelectorAll('.skew-scroll');
  skewElements.forEach(el => {
    el.style.transform = `skewY(${skewAmount}deg)`;
  });
  
  lastScrollTop = scrollTop;
});

// Reset skew when scroll stops
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const skewElements = document.querySelectorAll('.skew-scroll');
    skewElements.forEach(el => {
      el.style.transition = 'transform 0.3s ease';
      el.style.transform = 'skewY(0deg)';
    });
  }, 100);
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  if (window.pageYOffset > 100) {
    navbar.style.background = 'rgba(19,20,20,0.98)';
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    navbar.style.background = 'transparent';
    navbar.style.boxShadow = 'none';
  }
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
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

// ============================================
// CURSOR TRAIL EFFECT (OPTIONAL)
// ============================================
function initCursorTrail() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;
  
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(162,128,255,0.8), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(trail);
  
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    trail.style.transform = `translate(${trailX - 10}px, ${trailY - 10}px)`;
    requestAnimationFrame(animateTrail);
  }
  
  animateTrail();
}

// ============================================
// ENHANCED CURSOR TRAIL EFFECT (FIXED)
// ============================================
function initCursorTrail() {
  // Only initialize on non-touch devices
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;
  
  // Create cursor trail element
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(162,128,255,0.4), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: all 0.2s ease-out;
    mix-blend-mode: screen;
    opacity: 0.8;
  `;
  document.body.appendChild(trail);
  
  // Create cursor dot element
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.style.cssText = `
    position: fixed;
    width: 6px;
    height: 6px;
    background: rgba(162,128,255,0.9);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.1s ease-out;
    opacity: 1;
  `;
  document.body.appendChild(dot);
  
  // Current mouse position
  let mouseX = 0, mouseY = 0;
  let isMouseInWindow = true;
  
  // Update mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Direct position update for dot
    dot.style.left = (mouseX - 3) + 'px';
    dot.style.top = (mouseY - 3) + 'px';
    
    // Smooth follow for trail
    trail.style.left = (mouseX - 10) + 'px';
    trail.style.top = (mouseY - 10) + 'px';
  });
  
  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    isMouseInWindow = false;
    trail.style.opacity = '0';
    dot.style.opacity = '0';
  });
  
  // Show cursor when mouse enters window
  document.addEventListener('mouseenter', () => {
    isMouseInWindow = true;
    trail.style.opacity = '0.8';
    dot.style.opacity = '1';
  });
  
  // Add hover effects for interactive elements
  const interactiveElements = 'a, button, input, textarea, select, [onclick], .btn, .event-card, .hover-lift, .hover-scale';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(interactiveElements)) {
      trail.style.width = '30px';
      trail.style.height = '30px';
      trail.style.background = 'radial-gradient(circle, rgba(162,128,255,0.7), transparent)';
      trail.style.opacity = '1';
      
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.background = 'rgba(162,128,255,1)';
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(interactiveElements)) {
      trail.style.width = '20px';
      trail.style.height = '20px';
      trail.style.background = 'radial-gradient(circle, rgba(162,128,255,0.4), transparent)';
      trail.style.opacity = '0.8';
      
      dot.style.width = '6px';
      dot.style.height = '6px';
      dot.style.background = 'rgba(162,128,255,0.9)';
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    // Reset cursor position on resize
    if (isMouseInWindow) {
      trail.style.left = (mouseX - 10) + 'px';
      trail.style.top = (mouseY - 10) + 'px';
      dot.style.left = (mouseX - 3) + 'px';
      dot.style.top = (mouseY - 3) + 'px';
    }
  });
  
  // Initialize cursor position
  setTimeout(() => {
    trail.style.left = (mouseX - 10) + 'px';
    trail.style.top = (mouseY - 10) + 'px';
    dot.style.left = (mouseX - 3) + 'px';
    dot.style.top = (mouseY - 3) + 'px';
  }, 100);
}

// Cursor trail disabled for better UX and performance
// initCursorTrail();
