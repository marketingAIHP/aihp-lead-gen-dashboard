// Netlify serverless function to proxy NVIDIA API requests
// This solves CORS issues and keeps the API key secure on the server

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        // Get API key from environment variable (set in Netlify dashboard)
        const apiKey = process.env.NVIDIA_API_KEY;

        if (!apiKey) {
            console.error('NVIDIA_API_KEY not configured');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        // Call NVIDIA API from the server (no CORS issues here!)
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
            console.error('NVIDIA API Error:', errorData);
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    error: 'NVIDIA API error',
                    details: errorData
                })
            };
        }

        const data = await response.json();

        // Return the response to the frontend
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                // Allow requests from your Netlify domain
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
