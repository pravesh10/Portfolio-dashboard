# 🚀 Free Deployment Guide

Deploy your Portfolio Dashboard for free using Vercel (frontend) and Render (backend).

---

## 📋 Prerequisites

1. GitHub account
2. Vercel account (sign up at vercel.com)
3. Render account (sign up at render.com)

---

## 🔧 Step 1: Prepare for Deployment

### Update API URL in Frontend

Edit `frontend/services/api.ts` and update the base URL to use environment variable:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

---

## 📦 Step 2: Push to GitHub

```bash
cd /Users/kqpraves/Desktop/portfolio-dashboard

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Portfolio Dashboard"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio-dashboard.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 3: Deploy Backend on Render

### 3.1 Go to Render Dashboard
1. Visit https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### 3.2 Configure Backend Service

**Settings:**
```
Name: portfolio-backend
Region: Choose closest to you
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

**Environment Variables** (Add these in Render dashboard):
```
NODE_ENV=production
PORT=5000
ALPHA_VANTAGE_API_KEY=5TU03I2EY8V9W2BQ
USE_MOCK_DATA=true
```

**Instance Type:**
- Free (enough for demo)

### 3.3 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for build
3. Copy your backend URL (e.g., `https://portfolio-backend-xxxx.onrender.com`)

---

## 🌐 Step 4: Deploy Frontend on Vercel

### 4.1 Go to Vercel Dashboard
1. Visit https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### 4.2 Configure Frontend

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `frontend`

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```
(Replace with YOUR actual Render backend URL from Step 3.3)

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 4.3 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live at: `https://your-project.vercel.app`

---

## ✅ Step 5: Test Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. You should see the Portfolio Dashboard
3. All stocks with green/red color coding
4. Auto-refresh working

---

## 🔄 Step 6: Update Backend URL in Frontend

If you deployed backend first and got the URL, update it:

**In Vercel Dashboard:**
1. Go to your project
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` with your Render backend URL
4. Redeploy (Deployments → click "..." → Redeploy)

---

## 📊 Alternative: Deploy Both on Vercel

You can also deploy both on Vercel using serverless functions:

### Backend as API Routes

1. Move backend code to `frontend/pages/api/`
2. Convert Express routes to Next.js API routes
3. Single Vercel deployment for everything

---

## 🎯 Free Tier Limits

**Vercel:**
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Perfect for demos

**Render:**
- ✅ 750 hours/month (always on for demo)
- ⏸️ Sleeps after 15 min inactivity (cold start)
- ✅ Automatic HTTPS
- ✅ Free PostgreSQL database (if needed later)

---

## 🚀 Quick Deployment (One Command)

### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Deploy backend (as serverless)
cd ../backend
vercel --prod
```

---

## 📝 Post-Deployment Checklist

- [ ] Frontend loads at Vercel URL
- [ ] Backend API responds at Render URL
- [ ] Portfolio table shows data
- [ ] Green/Red color coding works
- [ ] Auto-refresh functions
- [ ] All 12 stocks display
- [ ] Sector summaries work
- [ ] Mobile responsive

---

## 🔒 Security Notes

**IMPORTANT:**
1. Never commit `.env` file to GitHub
2. `.env` is already in `.gitignore`
3. Set environment variables in Vercel/Render dashboards
4. Keep API key secure

---

## 🎨 Custom Domain (Optional)

**Vercel:**
1. Settings → Domains
2. Add your domain
3. Update DNS records

**Render:**
1. Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## 📞 Support

**Vercel Docs:** https://vercel.com/docs  
**Render Docs:** https://render.com/docs  
**Next.js Docs:** https://nextjs.org/docs

---

## ✨ Your Live Demo URLs

After deployment, you'll have:

```
Frontend: https://portfolio-dashboard-xxx.vercel.app
Backend API: https://portfolio-backend-xxx.onrender.com
```

Share these URLs for your demo! 🎉
