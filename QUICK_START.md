# 🚀 QUICK START - Deploy to Netlify in 5 Minutes

## ✅ What You Downloaded

- **aihp-dashboard-netlify.zip** - Complete project ready to deploy
- **DEPLOYMENT_GUIDE.md** - Detailed instructions (if needed)

---

## 🎯 FASTEST METHOD - Drag & Drop (2 Minutes)

### Step 1: Extract & Build

1. **Extract the ZIP file** you downloaded
2. **Open terminal/command prompt** in the extracted folder
3. **Run these commands:**

```bash
npm install
```
(Wait 1-2 minutes for packages to download)

```bash
npm run build
```
(Wait 30 seconds to build)

### Step 2: Deploy

1. **Go to:** https://app.netlify.com/drop
2. **Drag the `dist` folder** (that was just created) to the page
3. **Wait 10 seconds**
4. **Done!** ✅

Your site is live! You'll get a URL like:
`https://random-name-12345.netlify.app`

---

## 🔄 RECOMMENDED METHOD - GitHub Auto-Deploy (5 Minutes)

This method lets you update the site with just `git push` later.

### Step 1: Push to GitHub

1. **Extract the ZIP file**
2. **Open terminal** in the extracted folder
3. **Create GitHub repo** at https://github.com/new
   - Name: `aihp-dashboard`
   - Private repo ✅
4. **Run these commands:**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aihp-dashboard.git
git push -u origin main
```

### Step 2: Deploy on Netlify

1. **Go to:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Choose:** GitHub
4. **Select:** Your `aihp-dashboard` repository
5. **Click:** "Deploy site" (settings auto-detected)
6. **Wait 2-3 minutes** for build
7. **Done!** ✅

---

## 🎨 Customize Your URL

1. Netlify Dashboard → Site settings
2. Change site name to: `aihp-dashboard`
3. Your URL becomes: `https://aihp-dashboard.netlify.app`

---

## ✅ Test Your Deployed Site

1. **Visit your Netlify URL**
2. **Click:** "👔 Facility Manager Hiring" button
3. **Wait:** 30-60 seconds for AI research
4. **See:** Leads appear
5. **Click:** "Send Email" → Modal opens ✅
6. **Click:** "LinkedIn" → LinkedIn opens ✅

**All working? You're live!** 🎉

---

## 🔄 How to Update Later

### If you used GitHub method:
```bash
# Make changes to code
git add .
git commit -m "Updated X"
git push
```
Netlify auto-rebuilds in 2 minutes!

### If you used Drag & Drop:
```bash
npm run build
# Drag new dist folder to https://app.netlify.com/drop
```

---

## 🐛 Common Issues

### "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### "Build failed on Netlify"
**Solution:** 
```bash
# Test locally first:
npm install
npm run build
# If this works, deployment will work
```

### "Email button not working"
**This is normal!** Email button opens a modal.
1. Click "Send Email"
2. Click "Copy Email"
3. Paste in Gmail/Outlook

---

## 📞 Need Help?

Read the detailed **DEPLOYMENT_GUIDE.md** for:
- Step-by-step screenshots
- Troubleshooting guide
- Advanced features
- Custom domain setup

---

## 🎯 What You've Built

✅ AI-powered lead research dashboard
✅ Automated competitor filtering
✅ Personalized email templates
✅ LinkedIn integration
✅ Live on the internet!

**Start finding leads!** 🚀

---

**Next Steps:**
1. Bookmark your Netlify URL
2. Share with your team
3. Run daily research (Monday-Friday 9 AM)
4. Export weekly reports

Good luck! 🎉
