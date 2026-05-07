// Vercel Speed Insights injection script
// This script injects the Speed Insights tracking code into the page

(function() {
  // Initialize Speed Insights queue
  window.si = window.si || function () { 
    (window.siq = window.siq || []).push(arguments); 
  };

  // Create and inject the Speed Insights script
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/speed-insights/script.js';
  
  // Append to head
  document.head.appendChild(script);
})();
