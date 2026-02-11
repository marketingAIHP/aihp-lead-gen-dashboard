# Security Guidelines

## 🔒 Important Security Practices

### 1. Environment Variables

**NEVER commit API keys or secrets to Git!**

This project uses environment variables to keep sensitive data secure:

- ✅ **DO**: Store API keys in `.env` file (gitignored)
- ✅ **DO**: Use `.env.example` as a template
- ❌ **DON'T**: Hardcode API keys in source code
- ❌ **DON'T**: Commit `.env` files to Git

### 2. Setting Up Environment Variables

#### Local Development:

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

#### Netlify Deployment:

1. Go to your Netlify dashboard
2. Navigate to: **Site Settings → Environment Variables**
3. Add each variable:
   - Key: `VITE_ANTHROPIC_API_KEY`
   - Value: Your actual API key
4. Redeploy your site

### 3. API Key Security

**Anthropic API Key:**
- Get your key from: https://console.anthropic.com/
- Keep it secret - never share or commit it
- Rotate keys if accidentally exposed
- Monitor usage in Anthropic dashboard

### 4. Git Security Checklist

Before pushing to Git:

- [ ] `.env` file is NOT tracked (check with `git status`)
- [ ] `.gitignore` includes `.env` and `.env.*`
- [ ] No API keys in source code
- [ ] `.env.example` has placeholder values only
- [ ] Sensitive files are in `.gitignore`

### 5. What's Protected by .gitignore

The following are automatically excluded from Git:

- ✅ Environment files (`.env`, `.env.local`, etc.)
- ✅ Node modules (`node_modules/`)
- ✅ Build outputs (`dist/`, `build/`)
- ✅ Logs and temporary files
- ✅ OS-specific files (`.DS_Store`, `Thumbs.db`)
- ✅ IDE configurations (`.vscode/`, `.idea/`)
- ✅ Security files (`.pem`, `.key`, `.cert`)

### 6. Checking for Exposed Secrets

Before your first commit:

```bash
# Check what files will be committed
git status

# Make sure .env is NOT listed
# If it is, add it to .gitignore immediately

# View what will be committed
git diff --cached
```

### 7. If You Accidentally Commit Secrets

**If you accidentally commit API keys:**

1. **Immediately rotate the API key** in the service dashboard
2. Remove the file from Git history:
   ```bash
   git rm --cached .env
   git commit -m "Remove accidentally committed .env file"
   ```
3. For complete history removal (advanced):
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

### 8. Security Best Practices

- 🔐 Use strong, unique API keys
- 🔄 Rotate keys periodically
- 📊 Monitor API usage for anomalies
- 🚫 Never share `.env` files via email/chat
- ✅ Use environment variables for all secrets
- 🔍 Review code before committing
- 📝 Keep this SECURITY.md updated

### 9. Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Contact the project maintainer directly
3. Provide details about the vulnerability
4. Wait for confirmation before disclosure

---

**Remember: Security is everyone's responsibility!** 🛡️
