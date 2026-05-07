# Render Deployment Guide

## Prerequisites
- GitHub repository with your project code
- Render account (free tier available)
- MongoDB Atlas account (for production database)

## Step 1: Push to GitHub
1. Make sure your project is committed to Git:
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 2: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (whitelist Render's IP if needed)

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will automatically detect your `render.yaml` file

### Option B: Manual Setup
1. Create a new Web Service
2. Configure:
   - **Name**: tlds-events
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

## Step 4: Configure Environment Variables
In your Render service settings, add these environment variables:

### Required Variables:
```
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### Important Notes:
- Use your MongoDB Atlas connection string for `MONGO_URI`
- Use your production Razorpay credentials
- Generate a strong JWT secret
- Use your actual email credentials for notifications

## Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. Wait for the deployment to complete (usually 2-5 minutes)

## Step 6: Verify Deployment
1. Check the deployment logs in Render dashboard
2. Visit your app URL (provided by Render)
3. Test basic functionality:
   - Homepage loads
   - Events display
   - Admin panel accessible

## Troubleshooting

### Common Issues:
1. **MongoDB Connection Failed**
   - Check if MongoDB Atlas allows Render's IP
   - Verify connection string format

2. **Razorpay Authentication Error**
   - Verify your Razorpay API keys
   - Ensure you're using production keys for production

3. **Build Fails**
   - Check package.json for correct scripts
   - Ensure all dependencies are listed

4. **CORS Issues**
   - The app automatically includes Render's URL in CORS
   - Check browser console for specific errors

### Monitoring:
- Check Render logs for real-time errors
- Monitor MongoDB Atlas for database performance
- Set up Render alerts for downtime

## Post-Deployment
1. Set up custom domain (if needed)
2. Configure SSL (automatically handled by Render)
3. Set up monitoring and alerts
4. Test payment functionality thoroughly
5. Backup your database regularly

## Cost Optimization
- Free tier includes:
  - 750 hours/month of web service
  - 256MB RAM
  - Shared CPU
- Consider upgrading for production traffic
- Monitor usage to avoid unexpected charges
