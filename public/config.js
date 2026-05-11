/**
 * TLDS Events - Centralized Configuration
 * 
 * This file contains all environment-specific configurations.
 * Update the BASE_URL to match your deployment environment.
 */

(function() {
    'use strict';

    // Environment detection
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isNewDomain = hostname === 'events.thinklabdigitalsolutions.com';
    const isOldDomain = hostname === 'tldsevents.vercel.app';

    // Base API URL configuration
    // Priority: 1. Environment variable (if set in build), 2. Auto-detect based on domain, 3. Default Render URL
    const BASE_URL = (function() {
        // Check if API_URL is set via meta tag or global variable
        if (window.API_URL) {
            return window.API_URL;
        }

        // Auto-detect based on current domain
        if (isLocalhost) {
            // Local development - use localhost backend
            return 'http://localhost:5000';
        } else if (isNewDomain) {
            // New production domain - backend on Render
            // IMPORTANT: Update this to your actual Render backend URL
            return 'https://tldsevents-backend.onrender.com';
        } else if (isOldDomain) {
            // Old Vercel domain - still use Render backend
            return 'https://tldsevents-backend.onrender.com';
        } else {
            // Fallback - use Render backend
            return 'https://tldsevents-backend.onrender.com';
        }
    })();

    // Frontend URL for redirects and callbacks
    const FRONTEND_URL = (function() {
        if (window.FRONTEND_URL) {
            return window.FRONTEND_URL;
        }
        return window.location.origin;
    })();

    // Configuration object
    const config = {
        // API Configuration
        BASE_URL: BASE_URL,
        FRONTEND_URL: FRONTEND_URL,
        
        // Environment
        ENV: isLocalhost ? 'development' : 'production',
        IS_PRODUCTION: !isLocalhost,
        
        // Feature flags
        DEBUG: isLocalhost,
        
        // Razorpay configuration
        RAZORPAY: {
            // These will be fetched from /config endpoint
            keyId: null,
            getKey: async function() {
                try {
                    const response = await fetch(`${BASE_URL}/config`);
                    if (!response.ok) throw new Error('Failed to fetch Razorpay config');
                    const data = await response.json();
                    return data.key;
                } catch (error) {
                    console.error('Error fetching Razorpay key:', error);
                    throw error;
                }
            }
        },

        // API endpoints
        ENDPOINTS: {
            events: `${BASE_URL}/events`,
            pastEvents: `${BASE_URL}/past-events`,
            event: (id) => `${BASE_URL}/events/${id}`,
            availability: `${BASE_URL}/availability`,
            createOrder: `${BASE_URL}/create-order`,
            verifyPayment: `${BASE_URL}/verify-payment`,
            config: `${BASE_URL}/config`,
            contact: `${BASE_URL}/contact`,
            checkBooking: `${BASE_URL}/check-booking`,
            markBookingUsed: `${BASE_URL}/mark-booking-used`,
            markBookingUnused: `${BASE_URL}/mark-booking-unused`,
            downloadTicket: (bookingId) => `${BASE_URL}/download-ticket/${bookingId}`,
            admin: {
                login: `${BASE_URL}/admin-login`,
                data: `${BASE_URL}/admin-data`,
                deleteBooking: `${BASE_URL}/delete-booking`,
                deleteEvent: (id) => `${BASE_URL}/events/${id}`,
                updateEvent: (id) => `${BASE_URL}/events/${id}`,
                createEvent: `${BASE_URL}/events`,
                updateEventStatus: (id) => `${BASE_URL}/events/${id}/status`
            }
        },

        // Helper methods
        getAuthHeaders: function() {
            const token = localStorage.getItem('adminToken');
            return token ? { 'Authorization': `Bearer ${token}` } : {};
        },

        // Error logging
        logError: function(context, error) {
            if (this.DEBUG) {
                console.error(`[${context}]`, error);
            }
            // In production, you might want to send errors to a logging service
            if (this.IS_PRODUCTION && window.Sentry) {
                window.Sentry.captureException(error);
            }
        }
    };

    // Expose to global scope
    window.TLDS_CONFIG = config;
    
    // Also expose BASE_URL for backward compatibility
    window.BASE_URL = BASE_URL;

    // Log configuration in development
    if (config.DEBUG) {
        console.log('TLDS Events Config:', {
            BASE_URL: config.BASE_URL,
            FRONTEND_URL: config.FRONTEND_URL,
            ENV: config.ENV
        });
    }
})();
