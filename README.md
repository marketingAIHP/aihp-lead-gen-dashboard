# AIHP Lead Intelligence Dashboard

AI-powered lead research dashboard for finding companies looking for office space in Gurgaon.

## Features

- 🤖 **AI-Powered Research** - Automated web research using Claude AI
- 🔍 **7 Research Signals** - Facility hiring, funding, expansion, GCC, ecosystem mapping
- 🎯 **Ecosystem Mapping** - Find Google/IBM vendors & partners who need proximity
- 📧 **One-Click Outreach** - Personalized email templates
- 💼 **LinkedIn Integration** - Direct search for decision makers
- 🛡️ **Competitor Filtering** - Auto-filters Table Space, WeWork, Awfis, etc.
- 📊 **Lead Scoring** - HOT/WARM/QUALIFIED priority system

## 🚀 Deploy to Netlify

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

3. **Open browser:**
   - Visit `http://localhost:3000`

## 🔧 Configuration

### Environment Variables (Optional)

If you want to add environment variables:

1. In Netlify dashboard → Site settings → Environment variables
2. Add any API keys or configuration

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

### Build fails on Netlify:

Check build logs and ensure:
```bash
npm install  # Installs dependencies
npm run build  # Must succeed locally first
```

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
├── netlify.toml         # Netlify deployment config
└── README.md            # This file
```

## 🔄 Updating Your Site

After making changes:

```bash
git add .
git commit -m "Update description"
git push
```

Netlify will automatically rebuild and deploy!

## 💡 Tips

1. **Run research daily** (Monday-Friday 9 AM)
2. **Focus on ecosystem leads** (higher conversion)
3. **Use "Copy Email"** button for Gmail/Outlook web
4. **Export reports weekly** for team review
5. **Filter by "Hot"** tab for immediate outreach

## 📞 Support

For issues or questions:
- Check the build logs in Netlify dashboard
- Ensure all dependencies installed: `npm install`
- Test locally first: `npm run dev`

## 📄 License

Proprietary - AIHP Internal Use Only

---

**Built with React, Vite, Tailwind CSS, and Claude AI**

Last updated: February 2026
