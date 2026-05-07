# TLDS Events - Event Management System

A complete mobile-responsive event management system with payment integration, admin panel, and QR code ticketing.

## 🚀 Quick Deployment

### Option 1: Render (Recommended)
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub account
4. Select the `eventupdated` repository
5. Configure:
   - **Name**: `tlds-events`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add Environment Variables (see below)
7. Click "Create Web Service"

### Option 2: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `eventupdated`
4. Configure:
   - **Framework**: Other
   - **Build Command**: `npm install`
   - **Output Directory**: `public`
   - **Install Command**: `npm install`
5. Add Environment Variables
6. Deploy

### Option 3: Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Deploy from GitHub: `eventupdated`
4. Add Environment Variables
5. Deploy

## 📋 Environment Variables

Add these environment variables in your deployment platform:

```
PORT=5000
MONGO_URI=mongodb+srv://nagaadmin:naga321@cluster001.voij3zy.mongodb.net/?appName=Cluster001
RAZORPAY_KEY_ID=rzp_live_SSeBhHenfwGqtc
RAZORPAY_SECRET=0Hcoc6AbyMvpoYbpmKqXr8Jy
ADMIN_USERNAME=ajaykumar
ADMIN_PASSWORD=Thinklab@2026
JWT_SECRET=super_secure_jwt_key_2026
EMAIL_USER=nagapranav.shirisha@gmail.com
EMAIL_PASS=jkcs mafv lidj tihp
```

## 🛠️ Local Development

1. Clone the repository:
```bash
git clone https://github.com/Nagapranav15/eventupdated.git
cd eventupdated
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. Open http://localhost:5000

## 📱 Features

- **Mobile Responsive**: Works perfectly on all devices
- **Event Management**: Create, edit, and delete events
- **Online Booking**: Complete ticket booking system
- **Payment Integration**: Razorpay payment gateway
- **QR Code Tickets**: Digital tickets with QR codes
- **Admin Panel**: Complete admin dashboard
- **Scanner**: QR code validation system
- **Download Tickets**: PDF ticket download
- **Smooth Animations**: Enhanced user experience

## 🔐 Admin Access

- **URL**: `/admin.html`
- **Username**: `ajaykumar`
- **Password**: `Thinklab@2026`

## 📄 Pages

- **Homepage**: `/` - Event listing and registration
- **Event Details**: `/event.html?id={eventId}` - Event information and booking
- **Success**: `/success.html?booking={bookingId}` - Booking confirmation
- **Admin**: `/admin.html` - Admin panel
- **Scanner**: `/scanner.html` - QR code scanner
- **Privacy**: `/privacy.html` - Privacy policy
- **Terms**: `/terms.html` - Terms and conditions
- **Refund**: `/refund.html` - Refund policy
- **Contact**: `/contact.html` - Contact information

## 🎨 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, JavaScript
- **Payment**: Razorpay
- **Animations**: Custom CSS animations
- **QR Codes**: QR Server API

## 📞 Support

For any issues or questions, please contact the development team.

---

**Ready for production deployment! 🚀**
