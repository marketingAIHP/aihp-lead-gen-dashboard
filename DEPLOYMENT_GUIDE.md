# Step-by-Step Netlify Deployment Guide

## 📦 What You Have

All files are ready in the folder. Here's what's included:

```
netlify-deploy/
├── src/
│   ├── App.jsx          ✅ Your dashboard
│   ├── main.jsx         ✅ React entry
│   └── index.css        ✅ Styles
├── package.json         ✅ Dependencies
├── index.html           ✅ HTML template
├── vite.config.js       ✅ Build config
├── tailwind.config.js   ✅ Tailwind config
├── postcss.config.js    ✅ CSS config
├── netlify.toml         ✅ Netlify config
├── .gitignore           ✅ Git ignore
└── README.md            ✅ Documentation
```

---

## 🚀 Option 1: Deploy via GitHub (RECOMMENDED)

### Step 1: Install Git (if needed)

**Check if Git is installed:**
```bash
git --version
```

If not installed, download from: https://git-scm.com/

### Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click "+" → "New repository"
3. Name it: `aihp-lead-dashboard`
4. Keep it **Private** (recommended)
5. DON'T initialize with README (we already have one)
6. Click "Create repository"

### Step 3: Push Code to GitHub

**Open terminal/command prompt in the `netlify-deploy` folder and run:**

```bash
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AIHP Lead Dashboard"

# Set main branch
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/aihp-lead-dashboard.git

# Push to GitHub
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

### Step 4: Deploy on Netlify

1. **Go to https://www.netlify.com/**
2. **Sign up / Log in** (use GitHub account - it's easier)
3. **Click "Add new site"** → **"Import an existing project"**
4. **Choose "GitHub"**
5. **Authorize Netlify** to access your repositories
6. **Select `aihp-lead-dashboard`** repository
7. **Netlify auto-detects settings:**
   - Build command: `npm run build` ✅
   - Publish directory: `dist` ✅
   - (These should be pre-filled from netlify.toml)
8. **Click "Deploy site"**

### Step 5: Wait for Build

- First build takes 2-3 minutes
- Watch the build log for any errors
- When done, you'll see: "Site is live" ✅

### Step 6: Get Your URL

Your site is now live at:
```
https://random-name-12345.netlify.app
```

**You can customize this URL:**
1. Site settings → Domain management
2. Click "Options" → "Edit site name"
3. Change to: `aihp-dashboard.netlify.app`

---

## 🚀 Option 2: Deploy via Netlify CLI (FASTER)

### Step 1: Install Node.js (if needed)

Download from: https://nodejs.org/ (LTS version)

### Step 2: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 3: Navigate to Project Folder

```bash
cd netlify-deploy
```

### Step 4: Install Dependencies

```bash
npm install
```

Wait for packages to download (1-2 minutes).

### Step 5: Build the Project

```bash
npm run build
```

This creates a `dist` folder with your production files.

### Step 6: Login to Netlify

```bash
netlify login
```

Browser opens → Click "Authorize" → Return to terminal

### Step 7: Deploy

```bash
netlify deploy --prod
```

**Answer the prompts:**
- Create & configure new site? **Yes**
- Team: Select your team
- Site name: `aihp-dashboard` (or leave blank for random)
- Publish directory: **dist**

### Step 8: Done!

Terminal shows your live URL:
```
✅ Deploy is live!
🌍 Website URL: https://aihp-dashboard.netlify.app
```

---

## 🚀 Option 3: Drag & Drop (SIMPLEST - No Git/CLI)

### Step 1: Build Locally

**Open terminal in `netlify-deploy` folder:**

```bash
npm install
npm run build
```

This creates a `dist` folder.

### Step 2: Go to Netlify Drop

Visit: https://app.netlify.com/drop

### Step 3: Drag & Drop

1. Find the `dist` folder on your computer
2. Drag it to the Netlify Drop page
3. Wait 10-20 seconds
4. Done! ✅

**Your site is live!**

**Note:** With drag & drop, you need to manually rebuild and re-upload for updates.

---

## ✅ Verify Your Deployment

### Test These Features:

1. **Visit your Netlify URL**
2. **Click "👔 Facility Manager Hiring" button**
3. **Wait for AI research** (30-60 seconds)
4. **See leads appear**
5. **Click "Send Email"** → Modal should popup
6. **Click "LinkedIn"** → LinkedIn should open
7. **Click "Copy Email"** → Should copy to clipboard

### All working? ✅ You're deployed!

---

## 🔄 How to Update Your Site

### If deployed via GitHub:

```bash
# Make your changes in the code
# Then:
git add .
git commit -m "Updated feature X"
git push
```

Netlify automatically rebuilds and deploys! (2-3 minutes)

### If deployed via CLI:

```bash
npm run build
netlify deploy --prod
```

### If deployed via Drag & Drop:

```bash
npm run build
# Then drag the NEW dist folder to https://app.netlify.com/drop
```

---

## 🎨 Customize Your Site

### Change Site Name

1. Netlify Dashboard → Site settings
2. Site information → Change site name
3. Enter: `aihp-dashboard`
4. URL becomes: `https://aihp-dashboard.netlify.app`

### Add Custom Domain

1. Site settings → Domain management
2. Add custom domain → `dashboard.aihp.in`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Command not found: npm"

**Solution:** Install Node.js from https://nodejs.org/

### Issue 2: Build fails with "Cannot find module"

**Solution:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Issue 3: Email button doesn't open mail app

**This is normal!** The email button opens a modal with copy options.
1. Click "Send Email"
2. Click "Copy Email"  
3. Paste in Gmail/Outlook

### Issue 4: LinkedIn search doesn't work

**Solution:** Make sure you're logged into LinkedIn in your browser.

### Issue 5: Netlify build fails

**Check the build log for errors:**
1. Netlify Dashboard → Deploys
2. Click on failed deploy
3. Read the error message
4. Usually missing dependencies - run `npm install` locally first

---

## 📊 Monitor Your Site

### Netlify Dashboard Shows:

- **Deploy status** - Building / Published / Failed
- **Build time** - How long builds take
- **Visitor analytics** - How many people use it
- **Build logs** - Debug any issues

### Useful Netlify Features:

- **Deploy previews** - Test before publishing
- **Rollbacks** - Go back to previous version
- **Environment variables** - Add API keys securely
- **Custom headers** - Security configurations
- **Forms** - Collect data (if needed later)

---

## 💡 Best Practices

### 1. Test Locally First

Before deploying:
```bash
npm run dev  # Test at localhost:3000
npm run build  # Ensure build works
```

### 2. Use Environment Variables

For sensitive data (API keys):
1. Netlify Dashboard → Site settings → Environment variables
2. Add your keys
3. Reference in code: `import.meta.env.VITE_API_KEY`

### 3. Enable Auto-Deploy

With GitHub method, every `git push` auto-deploys.
Perfect for quick updates!

### 4. Check Build Minutes

Netlify free tier: 300 build minutes/month
Each build: 2-3 minutes
You can deploy ~100 times/month free!

---

## 🎯 Next Steps After Deployment

1. ✅ **Share URL with team**
2. ✅ **Test all features** (research, email, LinkedIn)
3. ✅ **Run daily research** (Monday-Friday 9 AM)
4. ✅ **Export weekly reports** for management
5. ✅ **Track conversion rates** (leads → site tours → deals)

---

## 📞 Get Help

### Netlify Support:
- Documentation: https://docs.netlify.com/
- Community: https://answers.netlify.com/
- Status: https://www.netlifystatus.com/

### Build Issues:
1. Check Netlify build log
2. Run `npm run build` locally
3. Check error messages
4. Google the specific error

---

## 🎉 Congratulations!

Your AIHP Lead Intelligence Dashboard is now live on the internet!

**What you've accomplished:**
✅ Modern React app deployed
✅ AI-powered lead research live
✅ Automatic builds on updates
✅ Professional URL for your team
✅ Scalable infrastructure (handles 1000s of users)

**Start researching and finding leads!** 🚀

---

**Questions?** Review this guide or check the README.md file.

Last updated: February 2026
