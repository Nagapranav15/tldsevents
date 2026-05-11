# TLDS Events - Production Deployment Checklist

## ✅ Changes Made to Productionize Application

### 1. Backend Configuration (`server.js`)
- [x] Updated CORS configuration to support new domain: `https://events.thinklabdigitalsolutions.com`
- [x] Added old domain for migration period: `https://tldsevents.vercel.app`
- [x] Added security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- [x] Configured CORS with credentials support for secure cookies
- [x] Added localhost origins for development

### 2. Centralized Frontend Configuration (`public/config.js`)
- [x] Created centralized configuration system
- [x] Automatic environment detection (localhost vs production)
- [x] Auto-detect domain-based API URL selection
- [x] Centralized endpoint definitions for all API routes
- [x] Error logging helper

### 3. Frontend Files Updated
- [x] `index.html` - Uses `TLDS_CONFIG.ENDPOINTS.events` and `TLDS_CONFIG.ENDPOINTS.pastEvents`
- [x] `event.html` - Uses `TLDS_CONFIG.ENDPOINTS.event()`, `availability`, `config`, `createOrder`, `verifyPayment`
- [x] `success.html` - Uses `TLDS_CONFIG.ENDPOINTS.downloadTicket()`
- [x] `scanner.html` - Uses `TLDS_CONFIG.ENDPOINTS.checkBooking`, `markBookingUsed`
- [x] `admin.html` - Uses all admin endpoints via `TLDS_CONFIG.ENDPOINTS.admin.*`
- [x] `script.js` - Uses `TLDS_CONFIG.ENDPOINTS.*`

### 4. Environment Configuration
- [x] `.env.example` - Updated with comprehensive production-safe template
- [x] `render.yaml` - Updated with FRONTEND_URL and new service name
- [x] Added security-related env vars (COOKIE_SECURE, COOKIE_SAME_SITE)

### 5. Documentation
- [x] `DEPLOYMENT.md` - Completely rewritten with new domain instructions
- [x] Added Razorpay configuration section
- [x] Added security checklist
- [x] Added troubleshooting guide
- [x] Added merchant approval checklist

---

## 🔧 Remaining Manual Steps (After Code Deployment)

### Step 1: Update Render Environment Variables

In your Render dashboard (https://dashboard.render.com):

1. Go to your Web Service → Environment
2. Add/Update these variables:

```
FRONTEND_URL=https://events.thinklabdigitalsolutions.com
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_live_razorpay_key
RAZORPAY_SECRET=your_live_razorpay_secret
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_random_32_char_secret
EMAIL_USER=info@thinklabdigitalsolutions.com
EMAIL_PASS=your_gmail_app_password
COOKIE_SECURE=true
```

### Step 2: Update Frontend API URL

In `public/config.js`, update the fallback URL to your actual Render backend:

```javascript
// Line ~32: Update this to your actual Render backend URL
return 'https://your-actual-render-backend-name.onrender.com';
```

### Step 3: Razorpay Dashboard Configuration

1. Log into https://dashboard.razorpay.com
2. Switch to **Live Mode** (top right toggle)
3. Go to Settings → API Keys → Generate Live Keys
4. Add allowed origins:
   - `https://events.thinklabdigitalsolutions.com`
5. Configure callback URLs:
   - Success: `https://events.thinklabdigitalsolutions.com/success.html`
   - Cancel: `https://events.thinklabdigitalsolutions.com/event.html`

### Step 4: MongoDB Atlas Configuration

1. Go to https://cloud.mongodb.com
2. In Network Access, add IP: `0.0.0.0/0` (or Render's specific IPs)
3. Copy connection string to Render env vars
4. Ensure database user has readWrite permissions

### Step 5: Deploy Frontend to New Domain

**Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
# Set custom domain in Vercel dashboard: events.thinklabdigitalsolutions.com
```

**Option B: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=public
# Set custom domain in Netlify dashboard
```

**Option C: Render Static Site**
1. Create new Static Site on Render
2. Connect GitHub repo
3. Set publish directory: `public`
4. Add custom domain

---

## 🧪 Testing Checklist

### Backend Tests
```bash
# Test health endpoint
curl https://your-backend.onrender.com/

# Test events endpoint
curl https://your-backend.onrender.com/events

# Test config endpoint (should return Razorpay key ID)
curl https://your-backend.onrender.com/config
```

### Frontend Tests
- [ ] Homepage loads events from new domain
- [ ] Event detail page loads correctly
- [ ] Booking form validates input
- [ ] Razorpay payment modal opens
- [ ] Payment success redirects correctly
- [ ] Success page shows QR code
- [ ] Ticket download works
- [ ] Admin panel login works
- [ ] QR scanner validates tickets
- [ ] Mark booking used/unused works

### Cross-Domain Tests
- [ ] Old domain (vercel.app) still works during migration
- [ ] New domain works correctly
- [ ] CORS errors not appearing in console
- [ ] Cookies work correctly (if using)

---

## 🔒 Security Verification

- [ ] No hardcoded API keys in any frontend file
- [ ] All secrets in environment variables
- [ ] Admin credentials changed from defaults
- [ ] JWT_SECRET is 32+ characters, random
- [ ] Using HTTPS for all communications
- [ ] Database not accessible publicly
- [ ] CORS properly configured (not allowing all origins)

---

## 📋 Razorpay Merchant Approval Requirements

### 1. Legal Pages ✓
- [x] Privacy Policy: `privacy.html`
- [x] Terms of Service: `terms.html`
- [x] Refund Policy: `refund.html`
- [x] Contact Page: `contact.html`

### 2. Technical Requirements
- [ ] Custom domain (not vercel.app subdomain)
- [ ] SSL/HTTPS enabled
- [ ] Working contact email
- [ ] Complete company information

### 3. Business Documentation Required
- [ ] Business registration certificate
- [ ] GST registration (if applicable)
- [ ] Bank account details
- [ ] Director/Owner ID proof
- [ ] Website screenshots showing full flow

### 4. Website Requirements
- [ ] Professional design
- [ ] Working payment flow
- [ ] Email notifications working
- [ ] QR code generation working
- [ ] Ticket scanning working

---

## 🚨 Common Issues & Solutions

### Issue: "Failed to load events" on frontend
**Cause**: Frontend cannot connect to backend
**Solution**:
1. Check CORS configuration includes your frontend domain
2. Verify `FRONTEND_URL` env var is set in Render
3. Check browser console for exact CORS error
4. Ensure backend is running (check Render logs)

### Issue: Razorpay payment not working
**Cause**: Test keys vs Live keys mismatch
**Solution**:
1. Verify using Live keys in production
2. Check domain is added to Razorpay allowed origins
3. Verify callback URLs are correct
4. Check browser console for JavaScript errors

### Issue: 500 errors on backend
**Cause**: Missing environment variables or DB connection
**Solution**:
1. Check Render logs for specific error
2. Verify all env vars are set
3. Test MongoDB connection string
4. Ensure database user has correct permissions

### Issue: Admin panel not accessible
**Cause**: CORS blocking admin requests
**Solution**:
1. Add admin panel domain to CORS origins
2. Check admin token is being sent correctly
3. Verify JWT_SECRET matches between login and verification

---

## 📞 Emergency Contacts

| Service | Support | Emergency |
|---------|---------|-----------|
| Render | support@render.com | Dashboard Status |
| Razorpay | support@razorpay.com | Dashboard Live Status |
| MongoDB | support@mongodb.com | Atlas Status |
| Domain | Your registrar | - |

---

## 📝 Cost Summary (Monthly)

| Service | Free Tier | Paid (Est.) |
|---------|-----------|-------------|
| Render Web Service | $0 | $7+ |
| Render PostgreSQL | $0 | $7+ |
| MongoDB Atlas (M0) | $0 | $57+ |
| Domain | - | ~$12/year |
| Razorpay | 2% + GST per txn | - |
| Gmail | $0 | $6/month (Workspace) |

**Estimated Monthly (Free Tier):** $0-5
**Recommended for Production:** $15-25/month

---

## 🎯 Success Metrics

After deployment, verify:
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Payment success rate > 95%
- [ ] Email delivery rate > 98%
- [ ] QR scan success rate = 100%
- [ ] No CORS errors in console
- [ ] No 500 errors in logs

---

**Last Updated:** May 2026
**Domain:** https://events.thinklabdigitalsolutions.com
**Status:** Ready for Production Deployment ✅
