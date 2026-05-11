# TLDS Events - Production Deployment Guide

## 🚀 Quick Deploy to New Domain

**New Production Domain:** `https://events.thinklabdigitalsolutions.com`

## Prerequisites
- GitHub repository with your project code
- Render account (free tier available)
- MongoDB Atlas account (for production database)
- Razorpay production account with activated keys
- Custom domain configured (if using)

---

## Step 1: Environment Configuration

### 1.1 Copy Environment Template
```bash
cp .env.example .env
```

### 1.2 Configure Environment Variables
Edit `.env` file with your production values:

```bash
# Database (MongoDB Atlas recommended)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tldsevents?retryWrites=true&w=majority

# Razorpay (Production Keys - Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_SECRET=your_live_secret_key

# Admin Credentials (Change from defaults!)
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password_123!

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secret_key_min_32_characters_long

# Email (Gmail with App Password)
EMAIL_USER=info@thinklabdigitalsolutions.com
EMAIL_PASS=your_gmail_app_password
```

---

## Step 2: Push to GitHub
```bash
git add .
git commit -m "Production deployment - new domain"
git push origin main
```

---

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "Blueprint" → "New Blueprint Instance"
3. Connect your GitHub repository
4. Render will use the `render.yaml` configuration

### Option B: Manual Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `tlds-events-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Starter for production)
4. Add environment variables from `.env.example`

---

## Step 4: Update Frontend Config

After deployment, update the `config.js` with your actual Render backend URL:

```javascript
// public/config.js
// Update this to your actual Render backend URL:
return 'https://tlds-events-backend.onrender.com';
```

**Deploy the frontend** to your new domain (`events.thinklabdigitalsolutions.com`).

---

## Step 5: Razorpay Production Configuration

### 5.1 Razorpay Dashboard Settings
1. Log into [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to Settings → API Keys
3. Ensure you're using **Live Mode** keys (not Test Mode)
4. Add allowed origins:
   - `https://events.thinklabdigitalsolutions.com`
   - `https://*.thinklabdigitalsolutions.com`

### 5.2 Payment Callback URLs
In Razorpay Dashboard → Settings → Checkout:
- **Success URL**: `https://events.thinklabdigitalsolutions.com/success.html`
- **Cancel URL**: `https://events.thinklabdigitalsolutions.com/event.html`

### 5.3 Webhook Configuration (Optional but Recommended)
- **URL**: `https://tlds-events-backend.onrender.com/webhook`
- **Secret**: Generate in Razorpay Dashboard
- **Events**: `payment.captured`, `order.paid`

---

## Step 6: Domain & SSL Configuration

### 6.1 If Using Custom Domain on Render
1. In Render Dashboard → Your Service → Settings → Custom Domains
2. Add your domain: `events.thinklabdigitalsolutions.com`
3. Follow Render's DNS configuration instructions
4. SSL certificate is automatically provisioned

### 6.2 If Using External Hosting (Vercel/Netlify/etc)
Ensure CORS is configured in `server.js` for your hosting domain.

---

## Step 7: Verify Deployment

### 7.1 Backend Health Check
```bash
curl https://tlds-events-backend.onrender.com/
```
Should return: Server running status

### 7.2 API Endpoints Test
- **Events**: `https://tlds-events-backend.onrender.com/events`
- **Config**: `https://tlds-events-backend.onrender.com/config` (should show Razorpay key ID)

### 7.3 Frontend Tests
1. Visit `https://events.thinklabdigitalsolutions.com`
2. Verify events load correctly
3. Test booking flow (use Razorpay test card: `5267 3181 8797 5449`)
4. Verify ticket download works
5. Test admin panel login

### 7.4 QR Scanner Tests
1. Visit `https://events.thinklabdigitalsolutions.com/scanner.html`
2. Test scanning a valid ticket QR code
3. Verify entry marking works

---

## 🔒 Security Checklist

- [ ] Changed default admin credentials
- [ ] Using production Razorpay keys (not test keys)
- [ ] JWT_SECRET is at least 32 characters and random
- [ ] MONGO_URI uses authenticated connection string
- [ ] COOKIE_SECURE=true for HTTPS
- [ ] No hardcoded API keys in frontend code
- [ ] All secrets stored in environment variables
- [ ] Database access restricted to Render IP

---

## 🚨 Troubleshooting

### CORS Errors
If you see CORS errors in browser console:
1. Check `server.js` CORS configuration includes your domain
2. Verify `FRONTEND_URL` env var is set correctly
3. Clear browser cache and try again

### Razorpay Payment Failures
1. Verify you're using LIVE mode keys
2. Check callback URLs are correctly set
3. Ensure domain is added to allowed origins
4. Check browser console for JavaScript errors

### Database Connection Issues
1. Verify MongoDB Atlas allows Render's IP (0.0.0.0/0 for testing)
2. Check connection string format
3. Ensure database user has correct permissions

### 500 Server Errors
1. Check Render logs for specific error messages
2. Verify all environment variables are set
3. Check database connection

---

## 📈 Post-Deployment

### Monitoring
- Set up Render alerts for downtime
- Monitor MongoDB Atlas metrics
- Track Razorpay transaction success rates
- Set up error tracking (e.g., Sentry)

### Backups
- Enable MongoDB Atlas automated backups
- Export booking data regularly
- Keep local copies of important event data

### Updates
- Test updates in staging first
- Keep dependencies updated
- Monitor security advisories for packages

---

## 🎯 Razorpay Merchant Approval Checklist

To get approved by Razorpay as a merchant:

1. **Legal Pages Present:**
   - [ ] Privacy Policy (`privacy.html`)
   - [ ] Terms of Service (`terms.html`)
   - [ ] Refund Policy (`refund.html`)
   - [ ] Contact Information (`contact.html`)

2. **Professional Appearance:**
   - [ ] Custom domain (not vercel.app)
   - [ ] SSL/HTTPS enabled
   - [ ] Working contact form/email
   - [ ] Professional branding

3. **Payment Flow Working:**
   - [ ] Successful test transactions
   - [ ] Proper payment confirmations
   - [ ] Ticket delivery via email
   - [ ] QR code generation working

4. **Business Documentation:**
   - [ ] Business registration documents
   - [ ] GST registration (if applicable)
   - [ ] Bank account details
   - [ ] Website/app screenshots

---

## 📞 Support Contacts

- **Render**: support@render.com
- **Razorpay**: support@razorpay.com
- **MongoDB Atlas**: support@mongodb.com

## 📝 Cost Estimates (Monthly)

- **Render (Free Tier)**: $0
- **MongoDB Atlas (M0)**: $0
- **Razorpay**: 2% + GST per transaction
- **Domain**: ~$10-15/year
- **Email (Gmail)**: $0

**Estimated Monthly Cost for Low Traffic**: $0-5
