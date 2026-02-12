# 🚀 Render Deployment Guide

## Overview

This project can be deployed on Render with:
- **Frontend**: Static Site (React + Vite)
- **Backend**: Web Service (Express.js API)

---

## Step 1: Deploy Backend (Web Service)

### 1.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository

### 1.2 Configure Backend

**Settings:**
- **Name**: `aihp-backend` (or your choice)
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free

### 1.3 Add Environment Variable

**Key**: `NVIDIA_API_KEY`  
**Value**: `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`

### 1.4 Deploy Backend

Click **Create Web Service**

**Copy the backend URL** (e.g., `https://aihp-backend.onrender.com`)

---

## Step 2: Deploy Frontend (Static Site)

### 2.1 Create New Static Site

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Static Site**
3. Connect your GitHub repository

### 2.2 Configure Frontend

**Settings:**
- **Name**: `aihp-dashboard` (or your choice)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 2.3 Add Environment Variable

**Key**: `VITE_API_URL`  
**Value**: `https://aihp-backend.onrender.com` (your backend URL from Step 1.4)

### 2.4 Deploy Frontend

Click **Create Static Site**

---

## Step 3: Update Local .env

For local development, create `.env`:

```env
VITE_API_URL=http://localhost:3001
```

---

## Testing

### Test Backend

```bash
cd server
npm install
npm start
```

Visit: `http://localhost:3001/health`

### Test Frontend

```bash
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## Architecture

```
┌─────────────────────────────────────────┐
│   Frontend (Static Site on Render)      │
│   - React + Vite                         │
│   - Calls: VITE_API_URL/api/research    │
└──────────────┬──────────────────────────┘
               │
               │ HTTP POST
               │
               ▼
┌─────────────────────────────────────────┐
│   Backend (Web Service on Render)       │
│   - Express.js                           │
│   - Endpoint: /api/research              │
│   - Has NVIDIA_API_KEY                   │
└──────────────┬──────────────────────────┘
               │
               │ NVIDIA API Call
               │
               ▼
┌─────────────────────────────────────────┐
│          NVIDIA API                      │
│   - Llama 3.1 405B                       │
└─────────────────────────────────────────┘
```

---

## Important Notes

1. **Backend must be deployed first** to get the URL
2. **Add backend URL to frontend** environment variables
3. **Free tier limitations**:
   - Backend may sleep after 15 min of inactivity
   - First request after sleep takes ~30 seconds
4. **Upgrade to paid tier** for always-on backend

---

## Summary

**Backend Deployment:**
- Root Directory: `server`
- Build: `npm install`
- Start: `npm start`
- Env: `NVIDIA_API_KEY`

**Frontend Deployment:**
- Build: `npm install && npm run build`
- Publish: `dist`
- Env: `VITE_API_URL` (backend URL)

**You're all set!** 🎉
