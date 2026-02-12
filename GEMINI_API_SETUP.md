# Gemini API 404 Error - Solution Guide

## The Problem

Your Google API key (`AIzaSyAzfKFdpGyWxvN-Vr-HElx-wUPNt94taWs`) is returning 404 errors when trying to access the Gemini API.

**Error:** `POST https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent 404 (Not Found)`

## Root Cause

The **Generative Language API (Gemini)** is not enabled for your API key. Google API keys need to have specific APIs enabled before they can be used.

---

## ✅ Solution: Enable the Generative Language API

### Step 1: Go to Google Cloud Console

1. Visit: **https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com**
2. Make sure you're logged in with the same Google account that created the API key

### Step 2: Enable the API

1. Click the **"Enable"** button
2. Wait for it to activate (takes 10-30 seconds)
3. You should see "API enabled" confirmation

### Step 3: Verify API Key

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Find your API key: `AIzaSyAzfKFdpGyWxvN-Vr-HElx-wUPNt94taWs`
3. Click on it to view details
4. Under "API restrictions", make sure either:
   - **"Don't restrict key"** is selected, OR
   - **"Generative Language API"** is in the allowed list

### Step 4: Test Your Site

1. Wait 1-2 minutes for changes to propagate
2. Refresh your Netlify site
3. Click a research button
4. It should work now! ✅

---

## Alternative: Create a New API Key

If the above doesn't work, create a fresh API key:

### Option A: Quick Method (AI Studio)

1. Go to: **https://aistudio.google.com/app/apikey**
2. Click **"Create API key"**
3. Select your project (or create new one)
4. Copy the new API key
5. Add it to Netlify:
   - Netlify Dashboard → Site Settings → Environment Variables
   - Key: `VITE_GOOGLE_API_KEY`
   - Value: Your new API key
6. Trigger new deploy

### Option B: Google Cloud Console

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy the new key
4. Click **"Edit API key"**
5. Under "API restrictions":
   - Select **"Restrict key"**
   - Check **"Generative Language API"**
6. Click **"Save"**
7. Add to Netlify (see Option A, step 5-6)

---

## Quick Links

| Action | URL |
|--------|-----|
| **Enable Gemini API** | https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com |
| **Create API Key (Easy)** | https://aistudio.google.com/app/apikey |
| **Manage API Keys** | https://console.cloud.google.com/apis/credentials |
| **View Enabled APIs** | https://console.cloud.google.com/apis/dashboard |

---

## After Enabling the API

Once you've enabled the Generative Language API:

1. **No code changes needed** - the current code is correct
2. **Wait 1-2 minutes** for Google's systems to update
3. **Refresh your site** and test
4. **AI features should work** immediately

---

## Still Not Working?

If you still get 404 errors after enabling the API:

### Check API Key Validity

Test your API key directly:

```bash
curl "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

Replace `YOUR_API_KEY` with your actual key.

**Expected response:** JSON with generated text
**If 404:** API not enabled or key invalid

### Common Issues

1. **Wrong Google Account**: Make sure you're logged into the correct Google account
2. **Billing Not Enabled**: Some projects require billing enabled (even for free tier)
3. **API Key Restrictions**: Check if key has IP or referrer restrictions
4. **Project Issues**: Try creating a new Google Cloud project

---

## Need Help?

Share the following information:

1. Did you enable the Generative Language API?
2. What happens when you visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
3. Is the API showing as "Enabled" or does it show an "Enable" button?
4. Any error messages when trying to enable it?
