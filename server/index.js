import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running' });
});

// NVIDIA API research endpoint
app.post('/api/research', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Get API key from environment variable
        const apiKey = process.env.NVIDIA_API_KEY;

        if (!apiKey) {
            console.error('NVIDIA_API_KEY not configured');
            return res.status(500).json({
                error: 'API key not configured',
                hint: 'Add NVIDIA_API_KEY to environment variables'
            });
        }

        console.log('Calling NVIDIA API...');

        // Call NVIDIA API
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'meta/llama-3.1-405b-instruct',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
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

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/research`);
});
