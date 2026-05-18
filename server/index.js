import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildNoStoreHeaders, getResearchConfig, runResearchRequest } from '../lib/research.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.DEV_API_PORT || 3101;

// Debug: List directory structure to help find the built frontend
import { readdirSync, existsSync } from 'fs';
console.log(`[SERVICE] DASHBOARD-BACKEND-NODE`);
console.log(`[DEBUG] Current working directory: ${process.cwd()}`);
console.log(`[DEBUG] __dirname: ${__dirname}`);
try {
    console.log(`[DEBUG] Root contents:`, readdirSync(path.join(__dirname, '..')));
    console.log(`[DEBUG] Current folder contents:`, readdirSync(__dirname));
} catch (e) {
    console.log(`[DEBUG] Error listing directories: ${e.message}`);
}

// Exhaustive search for dist folder
const possibleDistPaths = [
    path.join(__dirname, '..', 'dist'),          // Standard: ../dist
    path.join(__dirname, 'dist'),               // Fallback 1: ./dist
    path.join(process.cwd(), 'dist'),           // Fallback 2: cwd/dist
    path.join(process.cwd(), '..', 'dist'),      // Fallback 3: cwd/../dist
    '/opt/render/project/src/dist'              // Legacy hosted deployment fallback
];

let distPath = '';
for (const p of possibleDistPaths) {
    console.log(`[DEBUG] Checking for dist at: ${p}`);
    if (existsSync(p)) {
        distPath = p;
        console.log(`[DEBUG] FOUND dist folder at: ${p}`);
        break;
    }
}

if (!distPath) {
    console.error(`[CRITICAL] dist folder NOT FOUND anywhere! Checked: ${possibleDistPaths.join(', ')}`);
    // Default to something so it doesn't crash, but sends 404
    distPath = path.join(__dirname, '..', 'dist');
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
    const config = getResearchConfig();
    res.json({
        status: 'ok',
        time: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            HAS_OPENROUTER_KEY: !!config.apiKey,
            OPENROUTER_MODEL: config.model
        },
        distPath
    });
});

// 2. OpenRouter research endpoint
app.post('/api/research', async (req, res) => {
    console.log(`[${new Date().toISOString()}] Received research request`);
    try {
        const { prompt, requestId } = req.body;
        res.set(buildNoStoreHeaders());

        console.log(`Forwarding request to OpenRouter${requestId ? ` (requestId=${requestId})` : ''}...`);

        const result = await runResearchRequest({ prompt, requestId });
        if (!result.ok) {
            console.error('OpenRouter API Error:', result.status, result.body);
            return res.status(result.status).json(result.body);
        }

        console.log('OpenRouter response successful');
        res.status(result.status).json(result.body);

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
        res.status(404).send(`
            <h1>Frontend Not Built</h1>
            <p>The backend is running, but the frontend files are missing.</p>
            <p>Checked at: ${indexPath}</p>
            <hr>
            <p><b>Diagnostic:</b> If you are seeing this, your build step needs to run <code>npm install && npm run build</code>.</p>
        `);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/research`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
});

// Global error handlers for better debugging in hosted environments
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});
