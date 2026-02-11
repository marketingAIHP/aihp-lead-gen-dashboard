# Git Setup Guide

## 🚀 Quick Start - Push to GitHub

Follow these steps to push your project to GitHub:

### Step 1: Verify Security Setup

Before pushing to Git, make sure:

```bash
# Check that .env is NOT tracked
git status

# .env should NOT appear in the list
# If it does, it's already in .gitignore, so you're safe
```

### Step 2: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: AIHP Lead Intelligence Dashboard"
```

### Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `aihp-lead-dashboard` (or your preferred name)
3. Description: "AI-powered lead intelligence dashboard for office space prospects"
4. **Keep it Private** (recommended for business projects)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 4: Push to GitHub

```bash
# Set main branch
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/aihp-lead-dashboard.git

# Push to GitHub
git push -u origin main
```

### Step 5: Verify Upload

1. Go to your GitHub repository
2. Check that `.env` is **NOT** visible in the file list
3. Verify `.gitignore` is present
4. Confirm all source files are uploaded

---

## 🔄 Daily Git Workflow

After making changes:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Add new feature: ecosystem mapping"

# Push to GitHub
git push
```

---

## 📝 Good Commit Message Examples

- ✅ `"Add competitor filtering feature"`
- ✅ `"Fix email template generation bug"`
- ✅ `"Update README with deployment instructions"`
- ✅ `"Improve lead scoring algorithm"`
- ❌ `"Update"` (too vague)
- ❌ `"Fix stuff"` (not descriptive)
- ❌ `"asdfasdf"` (meaningless)

---

## 🌿 Branching Strategy (Optional)

For team collaboration:

```bash
# Create a new feature branch
git checkout -b feature/new-research-signal

# Make changes and commit
git add .
git commit -m "Add new research signal for GCC companies"

# Push branch to GitHub
git push -u origin feature/new-research-signal

# Create Pull Request on GitHub
# After review and merge, switch back to main
git checkout main
git pull
```

---

## 🔍 Useful Git Commands

```bash
# View commit history
git log --oneline

# See what changed in a file
git diff src/App.jsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes (CAREFUL!)
git reset --hard HEAD

# View remote repository URL
git remote -v

# Pull latest changes from GitHub
git pull origin main
```

---

## 🚨 Common Issues & Solutions

### Issue: "Permission denied (publickey)"

**Solution:** Set up SSH keys or use HTTPS with personal access token

```bash
# Use HTTPS instead
git remote set-url origin https://github.com/YOUR_USERNAME/aihp-lead-dashboard.git
```

### Issue: ".env file is showing in git status"

**Solution:** It's already in .gitignore, so it won't be committed. But if you want to remove it from tracking:

```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### Issue: "Merge conflict"

**Solution:**

```bash
# Pull latest changes first
git pull origin main

# Fix conflicts in your editor
# Then commit the merge
git add .
git commit -m "Resolve merge conflict"
git push
```

### Issue: "Large files won't push"

**Solution:** Make sure `node_modules/` and `dist/` are in `.gitignore`

```bash
# Remove from tracking if accidentally added
git rm -r --cached node_modules
git rm -r --cached dist
git commit -m "Remove large directories from tracking"
```

---

## 🔐 Security Checklist Before First Push

- [ ] `.env` file exists locally but is NOT tracked by Git
- [ ] `.gitignore` includes `.env` and `.env.*`
- [ ] No API keys in source code (check `src/App.jsx`)
- [ ] `.env.example` has placeholder values only
- [ ] `SECURITY.md` is included in repository
- [ ] Repository is set to **Private** on GitHub (for business projects)

---

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Ready to push? Follow Step 1 above!** 🚀
