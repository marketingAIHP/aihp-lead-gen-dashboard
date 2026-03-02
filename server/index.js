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

// Middleware
app.use(cors());
app.use(express.json());

// Serve built React frontend from ../dist
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// NVIDIA API research endpoint
app.post('/api/research', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Get API key — support both naming conventions
        const apiKey = process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY;

        if (!apiKey) {
            console.error('NVIDIA_API_KEY not configured');
            return res.status(500).json({
                error: 'API key not configured',
                hint: 'Add NVIDIA_API_KEY to Render environment variables'
            });
        }

        console.log('Calling NVIDIA API...');

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
            const errorData = await response.json();
            console.error('NVIDIA API Error:', response.status, errorData);
            return res.status(response.status).json({
                error: 'NVIDIA API error',
                status: response.status,
                details: errorData
            });
        }

        const data = await response.json();
        console.log('NVIDIA API success!');
        res.json(data);

    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/research`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
});
