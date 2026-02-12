// Netlify serverless function to proxy NVIDIA API requests
// This solves CORS issues and keeps the API key secure on the server

// Import fetch for Node.js (Netlify Functions use Node.js 18+)
import fetch from 'node-fetch';

export const handler = async (event, context) => {
    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            console.log('Error: No prompt provided');
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        // Get API key from environment variable (set in Netlify dashboard)
        const apiKey = process.env.NVIDIA_API_KEY;

        if (!apiKey) {
            console.error('CRITICAL: NVIDIA_API_KEY environment variable not set!');
            console.error('Please add NVIDIA_API_KEY to Netlify environment variables');
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: 'API key not configured',
                    hint: 'Add NVIDIA_API_KEY to Netlify environment variables'
                })
            };
        }

        console.log('Calling NVIDIA API...');

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
            console.error('NVIDIA API Error:', response.status, errorData);
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: 'NVIDIA API error',
                    status: response.status,
                    details: errorData
                })
            };
        }

        const data = await response.json();
        console.log('NVIDIA API success!');

        // Return the response to the frontend
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Function error:', error.message);
        console.error('Stack:', error.stack);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

