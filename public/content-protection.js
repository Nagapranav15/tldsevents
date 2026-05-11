/**
 * Content Protection Script
 * Disables copy, right-click, and inspect tools
 */

(function() {
    'use strict';

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // Disable copy/cut/paste
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    }, true);

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    }, true);

    document.addEventListener('paste', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // Disable keyboard shortcuts for inspect/copy
    document.addEventListener('keydown', function(e) {
        // F12 - Developer Tools
        if (e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+Shift+I - Inspect
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.keyCode === 73)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+Shift+J - Console
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.keyCode === 74)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+Shift+C - Inspect element
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.keyCode === 67)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+U - View source
        if (e.ctrlKey && (e.key === 'U' || e.keyCode === 85)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+S - Save page
        if (e.ctrlKey && (e.key === 'S' || e.keyCode === 83)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+P - Print
        if (e.ctrlKey && (e.key === 'P' || e.keyCode === 80)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+A - Select all
        if (e.ctrlKey && (e.key === 'A' || e.keyCode === 65)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+C - Copy
        if (e.ctrlKey && (e.key === 'C' || e.keyCode === 67)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl+X - Cut
        if (e.ctrlKey && (e.key === 'X' || e.keyCode === 88)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // Disable console access attempts
    (function() {
        const noop = function() {};
        
        // Try to detect dev tools opening
        let checkCount = 0;
        const checkDevTools = function() {
            checkCount++;
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > 100) {
                // Dev tools likely open
                window.location.reload();
            }
        };

        // Periodic check
        setInterval(checkDevTools, 2000);

        // Override console methods
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
            debug: console.debug
        };

        // Disable console when dev tools might be open
        setInterval(function() {
            console.log = noop;
            console.warn = noop;
            console.error = noop;
            console.info = noop;
            console.debug = noop;
        }, 1000);
    })();

    // Add CSS to disable selection
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
        }
        
        body {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
    `;
    document.head.appendChild(style);

    console.log('Content protection enabled');
})();
