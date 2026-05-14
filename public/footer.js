document.addEventListener('DOMContentLoaded', function() {
  const footerHTML = `
<footer>
  <div class="footer-content">
    <div class="footer-section">
      <h4>About TLDS Events</h4>
      <p>TLDS Events is a premier PR event registration platform powered by Thinklab Digital Solutions LLP. We specialize in PR events, attendee registrations, audience engagement, and digital event experiences across India.</p>
      <div class="powered-by">
        <span class="powered-badge">Powered by</span>
        <span class="powered-brand">ThinkLab Digital Solutions</span>
      </div>
    </div>
    <div class="footer-section">
      <h4>Quick Links</h4>
      <a href="index.html">Home</a>
      <a href="about.html">About Us</a>
      <a href="https://www.thinklabdigitalsolutions.com" target="_blank" rel="noopener noreferrer">Our Website</a>
      <a href="contact.html">Contact Us</a>
    </div>
    <div class="footer-section">
      <h4>Policies</h4>
      <a href="privacy.html">Privacy Policy</a>
      <a href="terms.html">Terms & Conditions</a>
      <a href="refund.html">Refund Policy</a>
      <a href="shipping.html">Shipping & Delivery Policy</a>
    </div>
    <div class="footer-section">
      <h4>Contact Us</h4>
      <p><strong>Email:</strong> info@thinklabdigitalsolutions.com</p>
      <p><strong>Phone:</strong> +91 XXXXX XXXXX</p>
      <p><strong>Address:</strong> Vijayawada, Andhra Pradesh, India</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 Thinklab Digital Solutions LLP. All rights reserved.</p>
    <p class="footer-legal">PR Events & Digital Event Experiences Platform</p>
  </div>
</footer>
<style>
/* Mobile Footer Styles */
@media (max-width: 768px) {
  footer {
    padding: 40px 20px 20px;
    margin-top: 60px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
  
  .footer-section h4 {
    font-size: 18px;
    margin-bottom: 15px;
    color: var(--accent);
  }
  
  .footer-section p {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  .footer-section a {
    font-size: 14px;
    margin-bottom: 8px;
    display: inline-block;
    transition: color 0.3s ease;
  }
  
  .footer-section a:hover {
    color: var(--accent);
  }
  
  .footer-bottom {
    margin-top: 30px;
    padding-top: 20px;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  
  .footer-bottom p {
    font-size: 12px;
    margin-bottom: 15px;
  }
  
  .social-links {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
  }
  
  .social-links a {
    font-size: 20px;
    text-decoration: none;
    transition: transform 0.3s ease, color 0.3s ease;
  }
  
  .social-links a:hover {
    transform: translateY(-3px);
    color: var(--accent);
  }
}

@media (max-width: 480px) {
  footer {
    padding: 30px 15px 15px;
  }
  
  .footer-section h4 {
    font-size: 16px;
  }
  
  .footer-section p,
  .footer-section a {
    font-size: 13px;
  }
  
  .social-links a {
    font-size: 18px;
    gap: 12px;
  }
}

/* Enhanced footer animations */
.footer-section {
  opacity: 0;
  transform: translateY(20px);
  animation: footerFadeIn 0.6s ease forwards;
}

.footer-section:nth-child(1) { animation-delay: 0.1s; }
.footer-section:nth-child(2) { animation-delay: 0.2s; }
.footer-section:nth-child(3) { animation-delay: 0.3s; }
.footer-section:nth-child(4) { animation-delay: 0.4s; }

@keyframes footerFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile optimized animation */
@media (max-width: 768px) {
  .footer-section {
    animation-duration: 0.4s;
  }
  
  .footer-section:nth-child(1) { animation-delay: 0.05s; }
  .footer-section:nth-child(2) { animation-delay: 0.1s; }
  .footer-section:nth-child(3) { animation-delay: 0.15s; }
  .footer-section:nth-child(4) { animation-delay: 0.2s; }
}

/* Powered by badge styling */
.powered-by {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(162, 128, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
}

.powered-badge {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.powered-brand {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
}

.footer-legal {
  font-size: 12px;
  color: var(--muted);
  margin-top: 5px;
}
</style>
`;

  // Insert footer before the closing body tag
  document.body.insertAdjacentHTML('beforeend', footerHTML);
  
  // Add mobile touch interactions for footer links
  if (window.matchMedia('(pointer: coarse)').matches) {
    const footerLinks = document.querySelectorAll('footer a');
    footerLinks.forEach(link => {
      link.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
      });
      
      link.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 100);
      });
    });
  }
});
