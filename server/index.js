import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Debug: List directory structure to help find dist folder on Render
import { readdirSync, existsSync } from 'fs';
console.log(`[DEBUG] Current working directory: ${process.cwd()}`);
console.log(`[DEBUG] __dirname: ${__dirname}`);
try {
    console.log(`[DEBUG] Root contents:`, readdirSync(path.join(__dirname, '..')));
    console.log(`[DEBUG] Current folder contents:`, readdirSync(__dirname));
} catch (e) {
    console.log(`[DEBUG] Error listing directories: ${e.message}`);
}

// Robustly find dist folder
let distPath = path.join(__dirname, '..', 'dist');
if (!existsSync(distPath)) {
    console.log(`[DEBUG] dist not found at ${distPath}, checking current folder...`);
    distPath = path.join(__dirname, 'dist');
    if (!existsSync(distPath)) {
        console.log(`[DEBUG] dist not found at ${distPath}, checking root...`);
        distPath = path.join(process.cwd(), 'dist');
    }
}
console.log(`[DEBUG] Resolved distPath: ${distPath}`);
if (existsSync(distPath)) {
    console.log(`[DEBUG] dist/index.html exists: ${existsSync(path.join(distPath, 'index.html'))}`);
} else {
    console.error(`[CRITICAL] dist folder NOT FOUND anywhere!`);
}

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json());

// 1. Health check (highest priority)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/ping', (req, res) => {
    res.json({
        status: 'ok',
        time: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            HAS_NVIDIA_KEY: !!(process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY)
        },
        distPath
    });
});

// 2. NVIDIA API research endpoint
app.post('/api/research', async (req, res) => {
    console.log(`[${new Date().toISOString()}] Received research request`);
    try {
        const { prompt } = req.body;

        if (!prompt) {
            console.log('Error: Prompt missing in request body');
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const apiKey = process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY;

        if (!apiKey) {
            console.error('CRITICAL: NVIDIA_API_KEY not configured in environment variables');
            return res.status(500).json({
                error: 'API key not configured',
                hint: 'Check Render dashboard Environment Variables'
            });
        }

        console.log('Forwarding request to NVIDIA API...');

        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'meta/llama-3.1-405b-instruct',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { detail: 'Could not parse error response from NVIDIA' };
            }
            console.error('NVIDIA API Error:', response.status, errorData);
            return res.status(response.status).json({
                error: 'NVIDIA API error',
                status: response.status,
                details: errorData
            });
        }

        const data = await response.json();
        console.log('NVIDIA API Response successful');
        res.json(data);

    } catch (error) {
        console.error('SERVER FATAL ERROR:', error.message);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// 3. Catch-all for undefined API routes (prevent fallback to index.html)
app.all('/api/*', (req, res) => {
    console.log(`[${new Date().toISOString()}] 404 API Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'API route not found' });
});

// 4. Serve static files
app.use(express.static(distPath));

// 5. SPA fallback (matches everything else)
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`Frontend not built. Looking for it at: ${indexPath}`);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/research`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
});

// Global error handlers for better debugging on Render
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});
