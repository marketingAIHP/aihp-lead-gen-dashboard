# AIHP Lead Intelligence Dashboard

AI-powered lead research dashboard for finding companies looking for office space in Gurgaon.

## Features

- 🤖 **AI-Powered Research** - Automated web research using OpenRouter
- 🔍 **7 Research Signals** - Facility hiring, funding, expansion, GCC, ecosystem mapping
- 🎯 **Ecosystem Mapping** - Find Google/IBM vendors & partners who need proximity
- 📧 **One-Click Outreach** - Personalized email templates
- 💼 **LinkedIn Integration** - Direct search for decision makers
- 🛡️ **Competitor Filtering** - Auto-filters Table Space, WeWork, Awfis, etc.
- 📊 **Lead Scoring** - HOT/WARM/QUALIFIED priority system

## 🚀 Deploy to Vercel

### Recommended Vercel Setup

1. Import the repository into Vercel.
2. Keep the build command as `npm run build`.
3. Add `OPENROUTER_API_KEY` in Project Settings → Environment Variables.
4. Optionally add `OPENROUTER_MODEL` if you want a model other than the default `openai/gpt-4o-mini`.
5. Redeploy so Vercel publishes both the static Vite app and the `/api/research` function.

The repo now includes Vercel API routes in `api/`, so the deployed frontend can call `/api/research` directly on the same domain.

## Alternative Netlify Deploy

### Method 1: Deploy from GitHub (Recommended)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aihp-dashboard.git
   git push -u origin main
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Build settings (should auto-detect):
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click "Deploy site"

3. **Done!** Your site will be live at `https://your-site-name.netlify.app`

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your project:**
   ```bash
   npm install
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify login
   netlify deploy --prod
   ```

4. **Follow prompts:**
   - Create & configure new site? Yes
   - Publish directory: `dist`

### Method 3: Drag & Drop

1. **Build locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Go to Netlify:**
   - Visit [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder to the upload area
   - Done!

## 📦 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```
   This starts both the Vite frontend on `http://localhost:3100` and the local API on `http://localhost:3101`.

3. **Open browser:**
   - Visit `http://localhost:3100`

## 🔧 Configuration

### Environment Variables

For Vercel:

1. Open Project Settings → Environment Variables
2. Add `OPENROUTER_API_KEY`
3. Optionally add `OPENROUTER_MODEL`
4. Redeploy the project

For Netlify:

1. Open Site settings → Environment variables
2. Add `OPENROUTER_API_KEY`
3. Optionally add `OPENROUTER_MODEL`

### Custom Domain

1. Netlify dashboard → Domain settings
2. Add custom domain
3. Follow DNS configuration instructions

## 📖 How to Use

### Daily Research Workflow:

1. **Click any research button** (e.g., "Facility Manager Hiring")
2. **Wait 30-60 seconds** for AI to research
3. **Review leads** in the dashboard
4. **Click "Send Email"** to get personalized template
5. **Click "LinkedIn"** to find decision makers

### Manual Research Controls:

- **👔 Facility Manager Hiring** - Companies hiring = expansion
- **💰 Recent Funding** - Startups with capital to grow
- **👥 Bulk Hiring** - 10+ positions = office needs
- **📈 Expansion Announcements** - Direct signals
- **🌍 GCC Setup** - Global companies setting up in India
- **🔗 Google Ecosystem** - Google vendors/partners
- **🔗 IBM Ecosystem** - IBM partners/integrators

### Custom Search:

Type any query like:
- "fintech companies Gurgaon Series B"
- "healthcare GCC India"
- "e-commerce startups hiring"

## 🎯 Features Explained

### Ecosystem Mapping

When Google leases 617K sq ft, their partners NEED proximity:
- Cloud integrators (for technical collaboration)
- Ad agencies (for partner events)
- Vendors (for on-site support)

The AI finds these companies and explains WHY they need space near Google.

### Competitor Filtering

Automatically excludes 18 workspace providers:
- Table Space, WeWork, Awfis, 91springboard
- Smartworks, Innov8, myHQ, Regus
- And 10 more...

### Personalized Emails

AI generates different templates based on:
- **Ecosystem leads** → Proximity value proposition
- **Funding leads** → Zero CapEx for startups
- **Hiring leads** → Fast 60-day move-in

## 🐛 Troubleshooting

### Build fails on Vercel or Netlify:

Check build logs and ensure:
```bash
npm install  # Installs dependencies
npm run build  # Must succeed locally first
```

### `/api/research` returns 404 on Vercel:

This means the deployment does not include the Vercel function yet.

1. Make sure the repo contains `api/research.js`
2. Confirm `OPENROUTER_API_KEY` is set in Vercel
3. Trigger a fresh redeploy

### Email button not working:

The email button opens a modal. Use "Copy Email" then paste in Gmail/Outlook.

### LinkedIn search not finding people:

LinkedIn requires login. Make sure you're logged into LinkedIn before clicking.

## 📝 Project Structure

```
aihp-dashboard/
├── src/
│   ├── App.jsx          # Main dashboard component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Build configuration
├── tailwind.config.js   # Tailwind configuration
├── api/                # Vercel serverless functions
├── lib/                # Shared OpenRouter backend logic
├── netlify.toml        # Netlify deployment config
├── vercel.json         # Vercel function config
└── README.md            # This file
```

## 🔄 Updating Your Site

After making changes:

```bash
git add .
git commit -m "Update description"
git push
```

Your hosting provider will automatically rebuild and deploy.

## 💡 Tips

1. **Run research daily** (Monday-Friday 9 AM)
2. **Focus on ecosystem leads** (higher conversion)
3. **Use "Copy Email"** button for Gmail/Outlook web
4. **Export reports weekly** for team review
5. **Filter by "Hot"** tab for immediate outreach

## 📞 Support

For issues or questions:
- Check the build logs in your hosting dashboard
- Ensure all dependencies installed: `npm install`
- Test locally first: `npm run dev`

## 📄 License

Proprietary - AIHP Internal Use Only

---

**Built with React, Vite, Tailwind CSS, and OpenRouter**

Last updated: February 2026
