/**
 * Content Protection Script - Reduced for Better UX
 * Only protects against right-click on images and basic inspection
 */

(function() {
    'use strict';

    // Disable right-click only on images to prevent image theft
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, true);

    // Disable drag and drop only on images
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, true);

    // Allow normal text selection for better UX
    // Removed: text selection disable, copy/cut/paste disable
    // Removed: aggressive keyboard shortcuts blocking
    // Removed: console detection and override
    // Removed: CSS user-select none

    console.log('Lightweight content protection enabled');
})();
