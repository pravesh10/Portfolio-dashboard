# Setup Instructions - Node.js Version Issue

## ⚠️ Problem

Your system has **Node.js 18.20.5**, but Next.js 14 requires **Node.js >= 20.9.0**.

The frontend didn't start because of this version incompatibility.

## ✅ Solution Options

### Option 1: Upgrade Node.js (Recommended)

1. **Install Node.js 20 using Homebrew:**
```bash
brew install node@20
```

2. **Link the new version:**
```bash
brew link node@20
```

3. **Verify the version:**
```bash
node --version
# Should show v20.x.x or higher
```

4. **Restart the frontend:**
```bash
cd /Users/kqpraves/Desktop/portfolio-dashboard/frontend
npm run dev
```

5. **Open browser to:** http://localhost:3000

---

### Option 2: Use Node Version Manager (nvm)

1. **Install nvm if not installed:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

2. **Close and reopen terminal, then:**
```bash
nvm install 20
nvm use 20
```

3. **Verify:**
```bash
node --version
```

4. **Restart the frontend:**
```bash
cd /Users/kqpraves/Desktop/portfolio-dashboard/frontend
npm run dev
```

---

### Option 3: Downgrade Next.js to version 13 (Works with Node 18)

If you can't upgrade Node.js, modify the frontend to use Next.js 13:

1. **Edit frontend/package.json:**
```bash
cd /Users/kqpraves/Desktop/portfolio-dashboard/frontend
```

2. **Change Next.js version from 14.x.x to 13.x.x:**
```json
{
  "dependencies": {
    "next": "^13.5.6",
    // ... rest stays the same
  }
}
```

3. **Reinstall dependencies:**
```bash
npm install
```

4. **Start the frontend:**
```bash
npm run dev
```

---

## 🔄 Current Status

✅ **Backend is RUNNING** on http://localhost:5000
❌ **Frontend is NOT RUNNING** (needs Node.js >= 20)

## 📋 Quick Checklist

After upgrading Node.js:

- [ ] Verify Node version: `node --version` (should be >= 20.9.0)
- [ ] Navigate to frontend: `cd /Users/kqpraves/Desktop/portfolio-dashboard/frontend`
- [ ] Start frontend: `npm run dev`
- [ ] Wait 10-15 seconds for compilation
- [ ] Open browser: http://localhost:3000
- [ ] You should see the Portfolio Dashboard!

## 🆘 If Still Having Issues

1. **Clear Next.js cache:**
```bash
cd /Users/kqpraves/Desktop/portfolio-dashboard/frontend
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

2. **Check backend is still running:**
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK",...}
```

3. **Check terminal for errors** - look for any error messages when running `npm run dev`

## 📞 Need Help?

The complete application is built and ready. You just need Node.js 20+ to run the frontend. The backend is working perfectly on port 5000!
