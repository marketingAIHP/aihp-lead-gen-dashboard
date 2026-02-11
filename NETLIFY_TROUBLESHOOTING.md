# Netlify 404 Error - Troubleshooting Guide

## Common Causes & Solutions

### 1. **Build Failed on Netlify**

The most common cause of 404 errors is a failed build.

**Check build logs:**
1. Go to Netlify Dashboard → Your Site → Deploys
2. Click on the latest deploy
3. Check the build log for errors

**Common build errors:**

#### Error: Missing dependencies
```bash
# Solution: Make sure package.json has all dependencies
npm install
npm run build  # Test locally first
```

#### Error: Environment variables missing
```bash
# The app uses Anthropic API - add environment variable in Netlify:
# Site Settings → Environment Variables → Add:
# Key: VITE_ANTHROPIC_API_KEY
# Value: your_api_key_here
```

#### Error: Node version mismatch
```toml
# Already configured in netlify.toml:
[build.environment]
  NODE_VERSION = "18"
```

---

### 2. **Wrong Publish Directory**

**Verify in Netlify:**
- Site Settings → Build & Deploy → Build settings
- **Publish directory** should be: `dist`
- **Build command** should be: `npm run build`

---

### 3. **Missing _redirects or netlify.toml**

Your `netlify.toml` is already configured correctly:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This handles SPA routing. If it's not working, try adding a `_redirects` file as backup.

---

### 4. **Build Locally First**

**Test the build on your machine:**

```bash
# Clean install
rm -rf node_modules dist
npm install

# Build
npm run build

# Check if dist folder was created
ls dist

# Preview the build
npm run preview
```

If the build fails locally, fix those errors first before deploying to Netlify.

---

## Step-by-Step Fix

### Option 1: Redeploy with Clear Cache

1. Go to Netlify Dashboard
2. Deploys → Trigger deploy → Clear cache and deploy site
3. Wait for build to complete
4. Check build logs for errors

### Option 2: Manual Deploy (Test)

```bash
# Build locally
npm run build

# Deploy manually
netlify deploy --prod --dir=dist
```

### Option 3: Check Deploy Settings

1. **Netlify Dashboard** → Site Settings → Build & Deploy
2. Verify:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18 (from netlify.toml)

### Option 4: Add Environment Variables

If using API features:
1. Site Settings → Environment Variables
2. Add: `VITE_ANTHROPIC_API_KEY` = your_key
3. Trigger new deploy

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Build works locally (`npm run build` succeeds)
- [ ] `dist` folder is created after build
- [ ] `netlify.toml` exists in project root
- [ ] Publish directory is set to `dist` in Netlify
- [ ] Build command is `npm run build`
- [ ] Node version is 18 or higher
- [ ] Environment variables are set (if needed)
- [ ] Latest deploy shows "Published" status

---

## Common Error Messages

### "Page not found" (Current Issue)

**Possible causes:**
1. Build failed → Check build logs
2. Wrong publish directory → Should be `dist`
3. Files not generated → Run `npm run build` locally

### "Failed to compile"

**Solution:**
- Check for syntax errors in JSX files
- Make sure all imports are correct
- Verify all dependencies are installed

### "Module not found"

**Solution:**
```bash
npm install
npm run build
```

---

## Still Not Working?

### Get Build Logs

1. Netlify Dashboard → Deploys → Click latest deploy
2. Copy the full build log
3. Look for the actual error message (usually in red)

### Common fixes:

**Clear everything and start fresh:**
```bash
# Locally
rm -rf node_modules dist package-lock.json
npm install
npm run build

# Then redeploy on Netlify with "Clear cache and deploy"
```

**Check file structure:**
```
project/
├── dist/              ← Should exist after build
│   ├── index.html
│   ├── assets/
│   └── ...
├── src/
├── package.json
├── netlify.toml       ← Must be in root
└── vite.config.js
```

---

## Need the Build Logs?

Share the build log from Netlify and I can help diagnose the specific issue. Look for:
- Red error messages
- "Error:" or "Failed:" lines
- Stack traces
- Missing module warnings
