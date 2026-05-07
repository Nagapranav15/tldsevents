document.addEventListener('DOMContentLoaded', function() {
  const pathname = window.location.pathname;
  let currentPage = pathname.split('/').pop();
  
  // Handle root URL or empty path
  if (!currentPage || currentPage === '' || pathname === '/') {
    currentPage = 'index.html';
  }
  
  const navbarHTML = `
<nav class="navbar">
  <div class="nav-container">
    <div class="logo">
      <a href="index.html">
        <img src="https://res.cloudinary.com/ddr8ylakx/image/upload/v1773825169/Untitled_design_27_m2fqif.png">
      </a>
    </div>
    <div class="nav-links" id="navLinks">
      <a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a>
      <a href="privacy.html" class="${currentPage === 'privacy.html' ? 'active' : ''}">Privacy Policy</a>
      <a href="refund.html" class="${currentPage === 'refund.html' ? 'active' : ''}">Refund Policy</a>
      <a href="terms.html" class="${currentPage === 'terms.html' ? 'active' : ''}">Terms of Service</a>
      <a href="contact.html" class="${currentPage === 'contact.html' ? 'active' : ''}">Contact Us</a>
    </div>
    <div class="hamburger" id="hamburger">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</nav>
<style>
/* Base Navigation Styles */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(19, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 15px 30px;
  transition: transform 0.3s ease;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.logo img {
  height: 50px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-links a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  position: relative;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--accent);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: 0.3s;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

/* Mobile Navigation Styles */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 5px;
  z-index: 1001;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: var(--text);
  margin: 3px 0;
  transition: 0.3s;
  border-radius: 2px;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -6px);
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }
  
  .nav-links {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background: var(--bg);
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0,0,0,0.05);
    backdrop-filter: blur(10px);
    padding: 20px 0;
    z-index: 1000;
  }
  
  .nav-links.active {
    left: 0;
  }
  
  .nav-links a {
    margin: 15px 0;
    font-size: 18px;
    opacity: 0;
    transform: translateY(-20px);
    animation: navFadeIn 0.5s ease forwards;
  }
  
  .nav-links.active a {
    opacity: 1;
    transform: translateY(0);
  }
  
  .nav-links a:nth-child(1) { animation-delay: 0.1s; }
  .nav-links a:nth-child(2) { animation-delay: 0.2s; }
  .nav-links a:nth-child(3) { animation-delay: 0.3s; }
  .nav-links a:nth-child(4) { animation-delay: 0.4s; }
  .nav-links a:nth-child(5) { animation-delay: 0.5s; }
  
  @keyframes navFadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* Enhanced mobile navbar */
@media (max-width: 480px) {
  .navbar {
    padding: 10px 20px;
  }
  
  .logo img {
    height: 40px;
  }
  
  .nav-links {
    top: 60px;
  }
  
  .nav-links a {
    font-size: 16px;
    margin: 12px 0;
  }
}
</style>
`;

  // Insert navbar after the opening body tag
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  
  // Mobile navigation functionality
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  console.log('Hamburger:', hamburger);
  console.log('NavLinks:', navLinks);
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Hamburger clicked');
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      console.log('Classes - Hamburger:', hamburger.classList.toString());
      console.log('Classes - NavLinks:', navLinks.classList.toString());
    });
    
    // Close mobile menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
    
    // Handle scroll behavior
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const navbar = document.querySelector('.navbar');
      
      if (navbar) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          // Scrolling down
          navbar.style.transform = 'translateY(-100%)';
        } else {
          // Scrolling up
          navbar.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollTop = scrollTop;
    });
  }
});
